
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tags } from "lucide-react";
import TagBadge from "./TagBadge";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onTagsChange }) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Теги:</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <TagBadge 
            key={index} 
            tag={tag} 
            variant="colored"
            onRemove={() => removeTag(tag)} 
          />
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Добавить тег..."
          className="text-sm"
          onKeyPress={handleKeyPress}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addTag} 
          disabled={!tagInput.trim()}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
};

export default TagManager;
