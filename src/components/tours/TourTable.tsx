
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import TourStatusBadge from './TourStatusBadge';
import { TourWithRelations } from '@/types/tour';
import { format } from 'date-fns';

interface TourTableProps {
  tours: TourWithRelations[];
  isLoading: boolean;
  onDelete: (tourId: string) => void;
}

const TourTable: React.FC<TourTableProps> = ({ 
  tours,
  isLoading,
  onDelete,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-lg shadow animate-pulse">
        <div className="h-10 bg-muted m-4 rounded-md"></div>
        <div className="h-10 bg-muted m-4 rounded-md"></div>
        <div className="h-10 bg-muted m-4 rounded-md"></div>
      </div>
    );
  }
  
  if (tours.length === 0) {
    return (
      <div className="w-full bg-card rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium mb-3">{t('tours.noToursFound')}</h3>
        <p className="text-muted-foreground mb-4">{t('tours.noToursDescription')}</p>
        <Button onClick={() => navigate('add')}>
          {t('tours.createTour')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-card rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('tours.id')}</TableHead>
            <TableHead>{t('tours.title')}</TableHead>
            <TableHead>{t('tours.startLocation')}</TableHead>
            <TableHead>{t('tours.endLocation')}</TableHead>
            <TableHead>{t('tours.startDate')}</TableHead>
            <TableHead>{t('tours.status')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.map((tour) => (
            <TableRow 
              key={tour.id}
              className="cursor-pointer"
              onClick={() => navigate(`${tour.id}`)}
            >
              <TableCell className="font-medium">
                {tour.id?.substring(0, 8)}
              </TableCell>
              <TableCell>{tour.title}</TableCell>
              <TableCell>{tour.start_location}</TableCell>
              <TableCell>{tour.end_location || '-'}</TableCell>
              <TableCell>
                {tour.start_date ? format(new Date(tour.start_date), 'dd.MM.yyyy') : '-'}
              </TableCell>
              <TableCell>
                <TourStatusBadge status={tour.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">{t('common.openMenu')}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${tour.id}/edit`);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('common.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t('tours.confirmDelete'))) {
                          onDelete(tour.id!);
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TourTable;
