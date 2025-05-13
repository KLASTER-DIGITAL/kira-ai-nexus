
import React from 'react';
import { Helmet } from 'react-helmet';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const Metadata: React.FC<MetadataProps> = ({
  title = 'KIRA AI - Интеллектуальный помощник',
  description = 'KIRA AI - ваш персональный ассистент для управления задачами и информацией',
  keywords = 'AI, искусственный интеллект, помощник, задачи, заметки, календарь',
  image = '/og-image.jpg',
  url = window.location.href,
}) => {
  const fullTitle = `${title} | KIRA AI`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};
