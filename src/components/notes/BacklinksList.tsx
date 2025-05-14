
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BacklinksListProps {
  links: Array<{
    id: string;
    nodes: {
      id: string;
      title: string;
    };
  }>;
  onLinkClick: (noteId: string) => void;
}

const BacklinksList: React.FC<BacklinksListProps> = ({ links, onLinkClick }) => {
  if (!links.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2 flex items-center">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Обратные ссылки ({links.length})
      </h4>
      <div className="flex flex-col space-y-1">
        {links.map((link) => (
          <Button
            key={link.id}
            variant="ghost"
            className="justify-start h-auto py-1 px-2 text-sm"
            onClick={() => onLinkClick(link.nodes.id)}
          >
            {link.nodes.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BacklinksList;
