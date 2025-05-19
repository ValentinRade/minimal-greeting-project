import React, { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  ChevronsUpDown, 
  Clock, 
  Globe, 
  Plus, 
  Save, 
  Trash2, 
  X 
} from 'lucide-react';
import { Employee, CreateEmployeeData, LicenseType } from '@/types/employee';

// Create zod schema for validation
const employeeSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  position: z.string().min(1, { message: 'Position is required' }),
  employee_type: z.enum(['employed', 'contractor']),
  payment_type: z.enum(['salary', 'invoice', 'credit']),
  hourly_rate: z.number().optional().or(z.literal('')).nullable(),
  net_salary: z.number().optional().or(z.literal('')).nullable(),
  gross_salary: z.number().optional().or(z.literal('')).nullable(),
  location: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  licenses: z.array(
    z.object({
      license_type: z.enum(['B', 'BE', 'C1', 'C1E', 'C', 'CE']) as z.ZodType<LicenseType>,
      description: z.string().optional().or(z.literal(''))
    })
  ),
  availability: z.array(
    z.object({
      day_of_week: z.number(),
      is_available: z.boolean(),
      start_time: z.string().optional().or(z.literal('')),
      end_time: z.string().optional().or(z.literal('')),
      notes: z.string().optional().or(z.literal(''))
    })
  ),
  regions: z.array(
    z.object({
      country: z.string()
    })
  )
});

type EmployeeFormProps = {
  defaultValues?: Employee;
  isEdit?: boolean;
  onSubmit: (data: CreateEmployeeData) => void;
  isLoading?: boolean;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  defaultValues,
  isEdit = false,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  // Create form with validation
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: defaultValues?.first_name || '',
      last_name: defaultValues?.last_name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      position: defaultValues?.position || '',
      employee_type: defaultValues?.employee_type || 'employed',
      payment_type: defaultValues?.payment_type || 'salary',
      hourly_rate: defaultValues?.hourly_rate || null,
      net_salary: defaultValues?.net_salary || null,
      gross_salary: defaultValues?.gross_salary || null,
      location: defaultValues?.location || '',
      notes: defaultValues?.notes || '',
      licenses: defaultValues?.licenses || [],
      // Initialize availability for all days of the week if not provided
      availability: defaultValues?.availability || 
        Array(7).fill(0).map((_, index) => ({
          day_of_week: index,
          is_available: false,
          start_time: '',
          end_time: '',
          notes: ''
        })),
      regions: defaultValues?.regions || []
    }
  });

  // Set up field arrays for repeating fields
  const {
    fields: licenseFields,
    append: appendLicense,
    remove: removeLicense
  } = useFieldArray({
    control: form.control,
    name: "licenses"
  });

  const {
    fields: regionFields,
    append: appendRegion,
    remove: removeRegion
  } = useFieldArray({
    control: form.control,
    name: "regions"
  });

  // Get availability fields and ensure they're sorted by day_of_week
  const availabilityFields = useFieldArray({
    control: form.control,
    name: "availability"
  }).fields.sort((a, b) => {
    // Sort from Monday(1) to Sunday(0)
    const dayA = a.day_of_week === 0 ? 7 : a.day_of_week;
    const dayB = b.day_of_week === 0 ? 7 : b.day_of_week;
    return dayA - dayB;
  });

  const employeeTypeOptions = [
    { value: 'employed', label: t('employees.typeEmployed') },
    { value: 'contractor', label: t('employees.typeContractor') }
  ];

  const paymentTypeOptions = [
    { value: 'salary', label: t('employees.paymentSalary') },
    { value: 'invoice', label: t('employees.paymentInvoice') },
    { value: 'credit', label: t('employees.paymentCredit') }
  ];

  const licenseTypeOptions = [
    { value: 'B', label: 'B', description: t('licenses.B') },
    { value: 'BE', label: 'BE', description: t('licenses.BE') },
    { value: 'C1', label: 'C1', description: t('licenses.C1') },
    { value: 'C1E', label: 'C1E', description: t('licenses.C1E') },
    { value: 'C', label: 'C', description: t('licenses.C') },
    { value: 'CE', label: 'CE', description: t('licenses.CE') }
  ];

  const countryOptions = [
    'Deutschland',
    'Österreich',
    'Schweiz',
    'Frankreich',
    'Italien',
    'Spanien',
    'Niederlande',
    'Belgien',
    'Luxemburg',
    'Polen',
    'Tschechien'
  ].map(country => ({ value: country, label: country }));

  const handleFormSubmit: SubmitHandler<z.infer<typeof employeeSchema>> = (data) => {
    // Convert string numbers to actual numbers
    const hourlyRate = data.hourly_rate ? Number(data.hourly_rate) : null;
    const netSalary = data.net_salary ? Number(data.net_salary) : null;
    const grossSalary = data.gross_salary ? Number(data.gross_salary) : null;

    // Ensure all required fields have values
    const submissionData: CreateEmployeeData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      position: data.position,
      employee_type: data.employee_type,
      payment_type: data.payment_type,
      hourly_rate: hourlyRate,
      net_salary: netSalary,
      gross_salary: grossSalary,
      location: data.location || undefined,
      notes: data.notes || undefined,
      // Ensure all required properties are present
      licenses: data.licenses.map(license => ({
        license_type: license.license_type,
        description: license.description
      })),
      availability: data.availability.map(avail => ({
        day_of_week: avail.day_of_week,
        is_available: avail.is_available,
        start_time: avail.start_time || undefined,
        end_time: avail.end_time || undefined,
        notes: avail.notes || undefined
      })),
      regions: data.regions.map(region => ({
        country: region.country
      }))
    };

    onSubmit(submissionData);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getDayName = (dayNumber: number) => {
    const days = [
      t('days.sunday'),
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday'),
      t('days.saturday')
    ];
    return days[dayNumber];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleCancel}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin">⌛</span>
                  {t('common.saving')}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? t('common.update') : t('common.save')}
                </span>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="personal">{t('employees.tabPersonal')}</TabsTrigger>
            <TabsTrigger value="licenses">{t('employees.tabLicenses')}</TabsTrigger>
            <TabsTrigger value="availability">{t('employees.tabAvailability')}</TabsTrigger>
            <TabsTrigger value="regions">{t('employees.tabRegions')}</TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.personalInformation')}</CardTitle>
                <CardDescription>
                  {t('employees.personalInfoDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.firstName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.lastName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.phone')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.position')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.location')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employee_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.employeeType')}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value: any) => field.onChange(value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('employees.selectEmployeeType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {employeeTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.paymentType')}</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value: any) => field.onChange(value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('employees.selectPaymentType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {paymentTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hourly_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.hourlyRate')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                            value={field.value === null ? '' : field.value} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="net_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.netSalary')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                            value={field.value === null ? '' : field.value} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gross_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.grossSalary')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} 
                            value={field.value === null ? '' : field.value} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('employees.notes')}</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end mt-6">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('licenses')}
                  >
                    {t('common.next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Licenses Tab */}
          <TabsContent value="licenses">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.driverLicenses')}</CardTitle>
                <CardDescription>
                  {t('employees.licensesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {licenseFields.length > 0 ? (
                        licenseFields.map((field, index) => {
                          const licenseType = form.getValues(`licenses.${index}.license_type`);
                          const licenseOption = licenseTypeOptions.find(option => option.value === licenseType);
                          
                          return (
                            <Badge key={field.id} variant="secondary" className="px-3 py-1 text-sm">
                              <span className="font-bold mr-1">{licenseOption?.label}</span>
                              {licenseOption?.description && (
                                <span className="text-xs">- {licenseOption.description}</span>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2"
                                onClick={() => removeLicense(index)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">{t('common.remove')}</span>
                              </Button>
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t('employees.noLicensesAdded')}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        appendLicense({
                          license_type: 'B',
                          description: ''
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addLicense')}
                    </Button>
                  </div>
                  
                  {licenseFields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardHeader className="py-4 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {t('employees.license')} {index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => removeLicense(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('common.remove')}</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4 space-y-4">
                        <FormField
                          control={form.control}
                          name={`licenses.${index}.license_type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('employees.licenseType')}</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('employees.selectLicenseType')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    {licenseTypeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex flex-col">
                                          <span>{option.label}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {option.description}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`licenses.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('employees.additionalDescription')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                {t('employees.licenseDescriptionHelper')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('personal')}
                  >
                    {t('common.previous')}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('availability')}
                  >
                    {t('common.next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.availability')}</CardTitle>
                <CardDescription>
                  {t('employees.availabilityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {availabilityFields.map((field, index) => {
                  const dayNumber = field.day_of_week;
                  const dayName = getDayName(dayNumber);
                  const isAvailableValue = form.watch(`availability.${index}.is_available`);
                  
                  return (
                    <Card key={field.id} className="mb-4">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {dayName}
                          </CardTitle>
                          <FormField
                            control={form.control}
                            name={`availability.${index}.is_available`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormLabel>
                                  {t('employees.available')}
                                </FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardHeader>
                      
                      {isAvailableValue && (
                        <CardContent className="py-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`availability.${index}.start_time`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('employees.startTime')}</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`availability.${index}.end_time`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('employees.endTime')}</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name={`availability.${index}.notes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('employees.notes')}</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={t('employees.availabilityNotesPlaceholder')} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('licenses')}
                  >
                    {t('common.previous')}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('regions')}
                  >
                    {t('common.next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Regions Tab */}
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.regions')}</CardTitle>
                <CardDescription>
                  {t('employees.regionsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {regionFields.length > 0 ? (
                        regionFields.map((field, index) => {
                          const country = form.getValues(`regions.${index}.country`);
                          
                          return (
                            <Badge key={field.id} variant="secondary" className="px-3 py-1 text-sm">
                              {country}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2"
                                onClick={() => removeRegion(index)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">{t('common.remove')}</span>
                              </Button>
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t('employees.noRegionsAdded')}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        appendRegion({
                          country: 'Deutschland'
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addRegion')}
                    </Button>
                  </div>
                  
                  {regionFields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {t('employees.region')} {index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => removeRegion(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('common.remove')}</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <FormField
                          control={form.control}
                          name={`regions.${index}.country`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('employees.country')}</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('employees.selectCountry')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    {countryOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab('availability')}
                  >
                    {t('common.previous')}
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin">⌛</span>
                        {t('common.saving')}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        {isEdit ? t('common.update') : t('common.save')}
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default EmployeeForm;
