
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  usePublicProfileByPath, 
  usePublicCompanyInfo, 
  useCompanyAwards, 
  useCompanyRatings 
} from '@/hooks/usePublicProfile';
import { useCompanyPublicData } from '@/hooks/useCompanyPublicData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  StarHalf, 
  Shield, 
  Award, 
  Calendar, 
  MapPin, 
  Truck, 
  GraduationCap, 
  Route, 
  Users,
  FileText,
  FileCheck,
  User,
  CheckCircle2
} from 'lucide-react';

const CompanyNotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('publicProfile.notFound')}</CardTitle>
          <CardDescription>
            {t('publicProfile.profileNotFoundDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('publicProfile.checkUrlOrContact')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
      ))}
      {hasHalfStar && <StarHalf className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

const ProfileSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <Card className="mb-6">
    <CardHeader className="flex flex-row items-center gap-2">
      <div className="bg-primary/10 p-2 rounded-md">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const PublicProfile: React.FC = () => {
  const { profilePath } = useParams<{ profilePath: string }>();
  const { t } = useTranslation();
  
  const { data: profile, isLoading: isProfileLoading } = usePublicProfileByPath(profilePath);
  const { data: company, isLoading: isCompanyLoading } = usePublicCompanyInfo(profile?.company_id);
  const { data: awards } = useCompanyAwards(profile?.company_id);
  const { data: ratings } = useCompanyRatings(profile?.company_id);
  
  const { 
    employees, 
    vehicles, 
    tours, 
    vehicleTypes, 
    totalVehicles,
    totalVehicleTypes,
    prequalifications,
    references,
    isLoading: isDataLoading,
    isPrequalificationsLoading,
    isReferencesLoading
  } = useCompanyPublicData(profile?.company_id);
  
  if (isProfileLoading || isCompanyLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }
  
  if (!profile || !company) {
    return <CompanyNotFound />;
  }
  
  // Calculate average rating
  const averageRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / ratings.length
    : 0;
    
  // Get founding year from company creation date
  const foundingYear = new Date(company.created_at).getFullYear();

  // Get active tours (status = 'in_progress')
  const activeTours = tours.filter(tour => tour.status === 'in_progress');
  
  // Get completed tours (status = 'completed')
  const completedTours = tours.filter(tour => tour.status === 'completed');

  // Count employees by position
  const driverCount = employees.filter(employee => 
    employee.position.toLowerCase().includes('fahrer') || 
    employee.position.toLowerCase().includes('driver')
  ).length;
  
  // Get common routes from tours
  const routeFrequency: Record<string, number> = {};
  tours.forEach(tour => {
    const routeName = `${tour.start_location} - ${tour.end_location || ''}`;
    routeFrequency[routeName] = (routeFrequency[routeName] || 0) + 1;
  });

  // Get top routes
  const topRoutes = Object.entries(routeFrequency)
    .filter(([route]) => route.includes(' - ') && !route.endsWith(' - ')) // Filter valid routes
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3)
    .map(([route]) => route);

  // Check if company has any prequalifications
  const hasPrequalifications = prequalifications && 
    (prequalifications.pq_kep || 
     prequalifications.bna_registration || 
     prequalifications.adr_certificate || 
     prequalifications.adr_1000_points || 
     prequalifications.eu_license || 
     prequalifications.other_qualification);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Company Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {company.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{company.city}, {company.country}</span>
              </div>
            </div>
            {awards && awards.length > 0 && (
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {awards.slice(0, 2).map((award) => (
                  <Badge key={award.id} variant="secondary" className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {award.title}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {profile.short_description && (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300">{profile.short_description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary w-5 h-5" />
              <div>
                <p className="text-sm text-muted-foreground">{t('publicProfile.established')}</p>
                <p className="font-medium">{t('publicProfile.since')} {foundingYear}</p>
              </div>
            </div>
            
            {ratings && ratings.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  <StarRating rating={averageRating} />
                </div>
                <div>
                  <p className="font-medium">{averageRating.toFixed(1)}/5.0</p>
                  <p className="text-sm text-muted-foreground">
                    {ratings.length} {t('publicProfile.reviews')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Shield className="text-primary w-5 h-5" />
              <div>
                <p className="font-medium">{t('publicProfile.verifiedSubcontractor')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Fleet Overview - Real Data */}
            {profile.show_fleet && (
              <ProfileSection 
                title={t('publicProfile.fleetOverview')} 
                icon={<Truck className="text-primary w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{totalVehicles}</p>
                    <p className="text-muted-foreground">{t('publicProfile.vehicles')}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{totalVehicleTypes}</p>
                    <p className="text-muted-foreground">{t('publicProfile.vehicleTypes')}</p>
                  </div>
                </div>
                {vehicleTypes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('publicProfile.vehicleCategories')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicleTypes.slice(0, 6).map(type => (
                        <Badge key={type.id} variant="outline">{type.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </ProfileSection>
            )}
            
            {/* Staff Overview */}
            {profile.show_fleet && employees.length > 0 && (
              <ProfileSection 
                title={t('publicProfile.staffOverview')} 
                icon={<User className="text-primary w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{employees.length}</p>
                    <p className="text-muted-foreground">{t('publicProfile.totalEmployees')}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{driverCount}</p>
                    <p className="text-muted-foreground">{t('publicProfile.drivers')}</p>
                  </div>
                </div>
                {employees.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('publicProfile.positions')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(employees.map(e => e.position)))
                        .slice(0, 6)
                        .map((position, idx) => (
                          <Badge key={idx} variant="outline">{position}</Badge>
                        ))}
                    </div>
                  </div>
                )}
              </ProfileSection>
            )}
            
            {/* Tours */}
            {profile.show_tours && (
              <ProfileSection 
                title={t('publicProfile.toursOverview')} 
                icon={<Route className="text-primary w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{completedTours.length}</p>
                    <p className="text-muted-foreground">{t('publicProfile.completedTours')}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">{activeTours.length}</p>
                    <p className="text-muted-foreground">{t('publicProfile.activeTours')}</p>
                  </div>
                </div>
                {topRoutes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">{t('publicProfile.frequentRoutes')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {topRoutes.map((route, index) => (
                        <Badge key={index} variant="outline">{route}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </ProfileSection>
            )}
            
            {/* References - Real Data */}
            {profile.show_references && references && references.length > 0 && (
              <ProfileSection 
                title={t('publicProfile.references')} 
                icon={<Users className="text-primary w-5 h-5" />}
              >
                <div className="space-y-4">
                  {references.map((reference) => (
                    <div key={reference.id} className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">
                          {reference.anonymize ? t('publicProfile.anonymousReference') : reference.customer_name || t('publicProfile.company')}
                        </h4>
                        <Badge>
                          {new Date(reference.start_date).getFullYear()} - 
                          {reference.until_today 
                            ? t('publicProfile.today') 
                            : reference.end_date && new Date(reference.end_date).getFullYear()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{reference.industry} - {reference.category}</p>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Prequalifications - Real Data */}
            {profile.show_qualifications && hasPrequalifications && !isPrequalificationsLoading && (
              <ProfileSection 
                title={t('publicProfile.prequalifications')} 
                icon={<GraduationCap className="text-primary w-5 h-5" />}
              >
                <div className="space-y-3">
                  {prequalifications.pq_kep && (
                    <div className="flex items-center justify-between">
                      <span>PQ KEP</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                  
                  {prequalifications.pq_kep && <Separator />}
                  
                  {prequalifications.bna_registration && (
                    <div className="flex items-center justify-between">
                      <span>{t('prequalifications.bnaRegistration')}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                  
                  {prequalifications.bna_registration && <Separator />}
                  
                  {prequalifications.adr_certificate && (
                    <div className="flex items-center justify-between">
                      <span>{t('prequalifications.adrCertificate')}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                  
                  {prequalifications.adr_certificate && <Separator />}
                  
                  {prequalifications.adr_1000_points && (
                    <div className="flex items-center justify-between">
                      <span>{t('prequalifications.adr1000')}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                  
                  {prequalifications.adr_1000_points && <Separator />}
                  
                  {prequalifications.eu_license && (
                    <div className="flex items-center justify-between">
                      <span>{t('prequalifications.euLicense')}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                  
                  {prequalifications.eu_license && prequalifications.other_qualification && <Separator />}
                  
                  {prequalifications.other_qualification && prequalifications.other_qualification_name && (
                    <div className="flex items-center justify-between">
                      <span>{prequalifications.other_qualification_name}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('publicProfile.verified')}
                      </Badge>
                    </div>
                  )}
                </div>
              </ProfileSection>
            )}
            
            {/* Documents Section */}
            {profile.show_qualifications && hasPrequalifications && (
              <ProfileSection 
                title={t('publicProfile.documents')} 
                icon={<FileCheck className="text-primary w-5 h-5" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Handelsregisterauszug</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Versicherungsbescheinigung</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>Steuerbescheinigung</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </ProfileSection>
            )}
            
            {/* Ratings - Real Data */}
            {profile.show_ratings && ratings && ratings.length > 0 && (
              <ProfileSection 
                title={t('publicProfile.ratings')} 
                icon={<Star className="text-primary w-5 h-5" />}
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="bg-primary-50 dark:bg-primary-950 rounded-full p-4">
                    <p className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</p>
                  </div>
                  <div>
                    <StarRating rating={averageRating} />
                    <p className="text-sm text-muted-foreground">
                      {ratings.length} {t('publicProfile.reviews')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {ratings.slice(0, 3).map((rating) => (
                    <div key={rating.id} className="border-t pt-3">
                      <div className="flex justify-between mb-1">
                        <StarRating rating={rating.rating_value} />
                        <span className="text-sm text-muted-foreground">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-sm">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}
            
            {/* Awards - Real Data */}
            {awards && awards.length > 0 && (
              <ProfileSection 
                title={t('publicProfile.awards')} 
                icon={<Award className="text-primary w-5 h-5" />}
              >
                <div className="space-y-3">
                  {awards.map((award) => (
                    <div key={award.id} className="flex items-start gap-3 p-3 border rounded-md">
                      <div className="bg-amber-100 text-amber-800 p-2 rounded-md">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{award.title}</h4>
                        {award.description && (
                          <p className="text-sm text-muted-foreground">{award.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(award.awarded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ProfileSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
