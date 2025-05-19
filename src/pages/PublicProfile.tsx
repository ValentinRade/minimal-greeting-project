
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePublicProfileByPath, usePublicCompanyInfo, useCompanyAwards, useCompanyRatings } from '@/hooks/usePublicProfile';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, StarHalf, Shield, Award, Calendar, MapPin, Truck, GraduationCap, Route, Users } from 'lucide-react';

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
  
  if (isProfileLoading || isCompanyLoading) {
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
            {/* Fleet Overview */}
            {profile.show_fleet && (
              <ProfileSection 
                title={t('publicProfile.fleetOverview')} 
                icon={<Truck className="text-primary w-5 h-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-muted-foreground">{t('publicProfile.vehicles')}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-muted-foreground">{t('publicProfile.vehicleTypes')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">{t('publicProfile.vehicleCategories')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">LKW 7.5t</Badge>
                    <Badge variant="outline">LKW 12t</Badge>
                    <Badge variant="outline">Sattelzug</Badge>
                    <Badge variant="outline">Kleintransporter</Badge>
                  </div>
                </div>
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
                    <p className="text-2xl font-bold">35</p>
                    <p className="text-muted-foreground">{t('publicProfile.completedTours')}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-muted-foreground">{t('publicProfile.activeTours')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">{t('publicProfile.frequentRoutes')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">München - Berlin</Badge>
                    <Badge variant="outline">Frankfurt - Hamburg</Badge>
                    <Badge variant="outline">Köln - Dresden</Badge>
                  </div>
                </div>
              </ProfileSection>
            )}
            
            {/* References */}
            {profile.show_references && (
              <ProfileSection 
                title={t('publicProfile.references')} 
                icon={<Users className="text-primary w-5 h-5" />}
              >
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Logistik GmbH</h4>
                      <Badge>2020 - 2023</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Regelmäßige Transporte im Raum Bayern</p>
                    <p className="italic text-sm">"Zuverlässiger Partner mit pünktlichen Lieferungen"</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Spedition Müller</h4>
                      <Badge>2019 - Heute</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">Internationale Stückguttransporte</p>
                    <p className="italic text-sm">"Flexibel und professionell, auch bei kurzfristigen Aufträgen"</p>
                  </div>
                </div>
              </ProfileSection>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Qualifications */}
            {profile.show_qualifications && (
              <ProfileSection 
                title={t('publicProfile.qualifications')} 
                icon={<GraduationCap className="text-primary w-5 h-5" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>ADR Zertifikat</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t('publicProfile.verified')}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>EU Lizenz</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t('publicProfile.verified')}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span>PQ KEP</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t('publicProfile.verified')}
                    </Badge>
                  </div>
                </div>
              </ProfileSection>
            )}
            
            {/* Ratings */}
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
            
            {/* Awards */}
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
