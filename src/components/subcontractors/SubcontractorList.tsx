
import React, { useState } from 'react';
import { SubcontractorSearchResult } from '@/hooks/useSubcontractorSearch';
import SubcontractorCard from './SubcontractorCard';
import SubcontractorDetailModal from './SubcontractorDetailModal';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubcontractorListProps {
  subcontractors: SubcontractorSearchResult[];
}

const SubcontractorList: React.FC<SubcontractorListProps> = ({ subcontractors }) => {
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string | null>(null);
  
  const selectedSubcontractor = subcontractors.find(
    (sub) => sub.id === selectedSubcontractorId
  );

  return (
    <>
      <ScrollArea className="h-[calc(100vh-330px)] pr-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {subcontractors.map((subcontractor) => (
            <SubcontractorCard
              key={subcontractor.id}
              subcontractor={subcontractor}
              onClick={() => setSelectedSubcontractorId(subcontractor.id)}
            />
          ))}
        </div>
      </ScrollArea>
      
      <SubcontractorDetailModal
        subcontractor={selectedSubcontractor}
        open={!!selectedSubcontractor}
        onClose={() => setSelectedSubcontractorId(null)}
      />
    </>
  );
};

export default SubcontractorList;
