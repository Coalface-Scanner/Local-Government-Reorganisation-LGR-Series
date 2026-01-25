import TopicHub from '../../components/TopicHub';
import MetaTags from '../../components/MetaTags';

interface StatecraftAndSystemDesignProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function StatecraftAndSystemDesign({ onNavigate }: StatecraftAndSystemDesignProps) {
  return (
    <>
      <MetaTags
        title="Statecraft and System Design - Thought Leadership Hub"
        description="Formal structures alone do not determine whether a council functions well. Outcomes are shaped by judgment, sequencing and how political authority is exercised in practice."
        keywords="statecraft, system design, institutional design, political judgment, operational systems, council governance"
      />
      <TopicHub
        themeName="Public Design"
        displayName="Statecraft and System Design"
        themeSlug="statecraft-and-system-design"
        onNavigate={onNavigate}
      />
    </>
  );
}
