
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateNew: () => void;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onCreateNew,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-10 text-center">
      {hasFilters ? (
        <>
          <p className="text-muted-foreground mb-4">
            По вашему запросу ничего не найдено
          </p>
          <Button onClick={onClearFilters}>Сбросить фильтры</Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">У вас пока нет заметок</p>
          <Button onClick={onCreateNew}>Создать первую заметку</Button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
