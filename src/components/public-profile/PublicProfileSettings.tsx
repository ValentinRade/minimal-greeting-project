
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, EyeOffIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicProfileSettings: React.FC = () => {
  const { t } = useTranslation();
  const { 
    profile, 
    isLoading, 
    createProfile, 
    updateProfile, 
    isCreatingProfile,
    isUpdatingProfile,
    publicUrl
  } = usePublicProfile();

  const [description, setDescription] = React.useState<string>('');
  
  React.useEffect(() => {
    if (profile?.short_description) {
      setDescription(profile.short_description);
    }
  }, [profile?.short_description]);
  
  const handleCreateProfile = () => {
    createProfile();
  };
  
  const handleToggleEnabled = () => {
    if (!profile) return;
    updateProfile({ enabled: !profile.enabled });
  };
  
  const handleSaveDescription = () => {
    if (!profile) return;
    updateProfile({ short_description: description });
  };
  
  const handleToggleSection = (section: keyof typeof profile, currentValue: boolean) => {
    if (!profile) return;
    const updateKey = `show_${section}` as keyof typeof profile;
    updateProfile({ [updateKey]: !currentValue } as any);
  };
  
  const copyProfileUrl = () => {
    if (!publicUrl) return;
    
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${publicUrl}`;
    
    navigator.clipboard.writeText(fullUrl).then(
      () => {
        toast({
          title: t('profile.urlCopied'),
          description: t('profile.urlCopiedDescription'),
        });
      },
      (err) => {
        console.error('Failed to copy URL: ', err);
        toast({
          title: t('profile.urlCopyFailed'),
          description: t('profile.urlCopyFailedDescription'),
          variant: 'destructive',
        });
      }
    );
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('publicProfile.createProfile')}</CardTitle>
          <CardDescription>
            {t('publicProfile.createProfileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t('publicProfile.noProfileYet')}</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateProfile} 
            disabled={isCreatingProfile}
          >
            {isCreatingProfile ? t('common.creating') : t('publicProfile.createButton')}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('publicProfile.settingsTitle')}</CardTitle>
              <CardDescription>
                {t('publicProfile.settingsDescription')}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="profile-enabled">{profile.enabled ? t('publicProfile.enabled') : t('publicProfile.disabled')}</Label>
              <Switch
                id="profile-enabled"
                checked={profile.enabled}
                onCheckedChange={handleToggleEnabled}
                disabled={isUpdatingProfile}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profile.enabled ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-6">
              <div className="flex items-center gap-2 mb-2">
                <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="font-medium text-green-800 dark:text-green-300">
                  {t('publicProfile.profileVisible')}
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                {t('publicProfile.profileVisibleDescription')}
              </p>
              
              {publicUrl && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={copyProfileUrl}>
                    {t('publicProfile.copyUrl')}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={publicUrl} target="_blank">
                      {t('publicProfile.viewProfile')} <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-6">
              <div className="flex items-center gap-2 mb-2">
                <EyeOffIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  {t('publicProfile.profileHidden')}
                </h3>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {t('publicProfile.profileHiddenDescription')}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <Label htmlFor="profile-description" className="mb-2 block">
              {t('publicProfile.companyDescription')}
            </Label>
            <Textarea
              id="profile-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('publicProfile.descriptionPlaceholder')}
              rows={5}
              className="mb-2"
            />
            <Button 
              size="sm"
              onClick={handleSaveDescription}
              disabled={isUpdatingProfile || description === profile.short_description}
            >
              {t('common.save')}
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">{t('publicProfile.visibleSections')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('publicProfile.visibleSectionsDescription')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="show-fleet">{t('publicProfile.showFleet')}</Label>
                <Switch
                  id="show-fleet"
                  checked={profile.show_fleet}
                  onCheckedChange={() => handleToggleSection('fleet', profile.show_fleet)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="show-references">{t('publicProfile.showReferences')}</Label>
                <Switch
                  id="show-references"
                  checked={profile.show_references}
                  onCheckedChange={() => handleToggleSection('references', profile.show_references)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="show-qualifications">{t('publicProfile.showQualifications')}</Label>
                <Switch
                  id="show-qualifications"
                  checked={profile.show_qualifications}
                  onCheckedChange={() => handleToggleSection('qualifications', profile.show_qualifications)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="show-tours">{t('publicProfile.showTours')}</Label>
                <Switch
                  id="show-tours"
                  checked={profile.show_tours}
                  onCheckedChange={() => handleToggleSection('tours', profile.show_tours)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="show-ratings">{t('publicProfile.showRatings')}</Label>
                <Switch
                  id="show-ratings"
                  checked={profile.show_ratings}
                  onCheckedChange={() => handleToggleSection('ratings', profile.show_ratings)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('publicProfile.profileUrlTitle')}</CardTitle>
          <CardDescription>{t('publicProfile.profileUrlDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">URL</Badge>
            <code className="bg-muted p-2 rounded text-sm flex-1">{profile.profile_url_path}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfileSettings;
