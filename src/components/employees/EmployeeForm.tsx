import React, { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarClock, 
  HelpCircle, 
  Map, 
  PersonStanding, 
  Plus, 
  Trash2, 
  X 
} from 'lucide-react';
import { Employee, CreateEmployeeData, LicenseType, PaymentType } from '@/types/employee';

// Create zod schema for validation
const employeeSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  position: z.string().min(1, { message: "Position is required" }),
  employee_type: z.enum(['employed', 'contractor']),
  payment_type: z.enum(['salary', 'invoice', 'credit']),
  hourly_rate: z.string().optional().or(z.literal('')),
  net_salary: z.string().optional().or(z.literal('')),
  gross_salary: z.string().optional().or(z.literal('')),
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

type FormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  defaultValues?: Employee;
  onSubmit: (data: CreateEmployeeData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form with default values or employee data
  const form = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues ? {
      first_name: defaultValues.first_name,
      last_name: defaultValues.last_name,
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      position: defaultValues.position,
      employee_type: defaultValues.employee_type,
      payment_type: defaultValues.payment_type,
      hourly_rate: defaultValues.hourly_rate?.toString() || '',
      net_salary: defaultValues.net_salary?.toString() || '',
      gross_salary: defaultValues.gross_salary?.toString() || '',
      location: defaultValues.location || '',
      notes: defaultValues.notes || '',
      licenses: defaultValues.licenses?.map(license => ({
        license_type: license.license_type,
        description: license.description || ''
      })) || [],
      availability: Array.from({ length: 7 }, (_, i) => {
        const existingAvail = defaultValues.availability?.find(a => a.day_of_week === i);
        return {
          day_of_week: i,
          is_available: existingAvail?.is_available || false,
          start_time: existingAvail?.start_time || '',
          end_time: existingAvail?.end_time || '',
          notes: existingAvail?.notes || ''
        };
      }),
      regions: defaultValues.regions?.map(region => ({
        country: region.country
      })) || []
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',
      employee_type: 'employed',
      payment_type: 'salary',
      hourly_rate: '',
      net_salary: '',
      gross_salary: '',
      location: '',
      notes: '',
      licenses: [],
      availability: Array.from({ length: 7 }, (_, i) => ({
        day_of_week: i,
        is_available: false,
        start_time: '',
        end_time: '',
        notes: ''
      })),
      regions: []
    }
  });

  // Use field arrays for licenses and regions
  const { fields: licenseFields, append: appendLicense, remove: removeLicense } = useFieldArray({
    control: form.control,
    name: "licenses"
  });

  const { fields: regionFields, append: appendRegion, remove: removeRegion } = useFieldArray({
    control: form.control,
    name: "regions"
  });

  const handleAddLicense = () => {
    appendLicense({ license_type: 'B', description: '' });
  };

  const handleAddRegion = () => {
    appendRegion({ country: '' });
  };

  // Get the available countries
  const availableCountries = [
    "Germany", "Austria", "Switzerland", "France", "Italy", 
    "Netherlands", "Belgium", "Luxembourg", "Denmark", "Poland", 
    "Czech Republic", "Spain", "Portugal"
  ];

  // Day names for availability table
  const dayNames = [
    t('days.sunday'),
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday'),
    t('days.saturday')
  ];

  const handleSubmit = (data: FormValues) => {
    // Convert string values to numbers
    const hourlyRate = data.hourly_rate ? Number(data.hourly_rate) : undefined;
    const netSalary = data.net_salary ? Number(data.net_salary) : undefined;
    const grossSalary = data.gross_salary ? Number(data.gross_salary) : undefined;

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
        description: license.description || ''
      })),
      availability: data.availability.map(avail => ({
        day_of_week: avail.day_of_week,
        is_available: avail.is_available,
        start_time: avail.start_time || '',
        end_time: avail.end_time || '',
        notes: avail.notes || ''
      })),
      regions: data.regions.map(region => ({
        country: region.country
      }))
    };

    onSubmit(submissionData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="personal">
              <PersonStanding className="h-4 w-4 mr-2" />
              {t('employees.tabPersonal')}
            </TabsTrigger>
            <TabsTrigger value="licenses">
              <HelpCircle className="h-4 w-4 mr-2" />
              {t('employees.tabLicenses')}
            </TabsTrigger>
            <TabsTrigger value="availability">
              <CalendarClock className="h-4 w-4 mr-2" />
              {t('employees.tabAvailability')}
            </TabsTrigger>
            <TabsTrigger value="regions">
              <Map className="h-4 w-4 mr-2" />
              {t('employees.tabRegions')}
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.personalInformation')}</CardTitle>
                <CardDescription>
                  {t('employees.personalInfoDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.email')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="employee_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.employeeType')}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('employees.selectEmployeeType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employed">{t('employees.typeEmployed')}</SelectItem>
                            <SelectItem value="contractor">{t('employees.typeContractor')}</SelectItem>
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
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('employees.selectPaymentType')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="salary">{t('employees.paymentSalary')}</SelectItem>
                            <SelectItem value="invoice">{t('employees.paymentInvoice')}</SelectItem>
                            <SelectItem value="credit">{t('employees.paymentCredit')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="hourly_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('employees.hourlyRate')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
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
                          <Input {...field} type="number" />
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
                          <Input {...field} type="number" />
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
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <CardContent>
                {licenseFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <p>{t('employees.noLicensesAdded')}</p>
                    <Button 
                      type="button" 
                      onClick={handleAddLicense}
                      className="mt-4"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addLicense')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {licenseFields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-4 pb-4 border-b">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`licenses.${index}.license_type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('employees.licenseType')}</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('employees.selectLicenseType')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="B">B</SelectItem>
                                      <SelectItem value="BE">BE</SelectItem>
                                      <SelectItem value="C1">C1</SelectItem>
                                      <SelectItem value="C1E">C1E</SelectItem>
                                      <SelectItem value="C">C</SelectItem>
                                      <SelectItem value="CE">CE</SelectItem>
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
                                  <FormLabel>
                                    {t('employees.additionalDescription')}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="h-4 w-4 inline-block ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t('employees.licenseDescriptionHelper')}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-8"
                          onClick={() => removeLicense(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      onClick={handleAddLicense}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addLicense')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.weeklySchedule')}</CardTitle>
                <CardDescription>
                  {t('employees.scheduleDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">{t('days.sunday')}</TableHead>
                      <TableHead>{t('employees.availability')}</TableHead>
                      <TableHead>{t('employees.hours')}</TableHead>
                      <TableHead>{t('employees.notes')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.getValues().availability.map((avail, index) => (
                      <TableRow key={index}>
                        <TableCell>{dayNames[avail.day_of_week]}</TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`availability.${index}.is_available`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer">
                                  {field.value ? t('employees.available') : t('employees.unavailable')}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {form.watch(`availability.${index}.is_available`) && (
                            <div className="flex space-x-2">
                              <FormField
                                control={form.control}
                                name={`availability.${index}.start_time`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="time"
                                        className="w-full"
                                        placeholder={t('employees.startTime')}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <span className="self-center">-</span>
                              <FormField
                                control={form.control}
                                name={`availability.${index}.end_time`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="time"
                                        className="w-full"
                                        placeholder={t('employees.endTime')}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {form.watch(`availability.${index}.is_available`) && (
                            <FormField
                              control={form.control}
                              name={`availability.${index}.notes`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={t('employees.availabilityNotesPlaceholder')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle>{t('employees.workRegions')}</CardTitle>
                <CardDescription>
                  {t('employees.regionsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {regionFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <p>{t('employees.noRegionsAdded')}</p>
                    <Button 
                      type="button" 
                      onClick={handleAddRegion}
                      className="mt-4"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addRegion')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {regionFields.map((field, index) => (
                      <div key={field.id} className="flex items-start gap-4 pb-4 border-b">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`regions.${index}.country`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('employees.country')}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('employees.selectCountry')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableCountries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-8"
                          onClick={() => removeRegion(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      onClick={handleAddRegion}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('employees.addRegion')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : (isEdit ? t('common.update') : t('common.save'))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
