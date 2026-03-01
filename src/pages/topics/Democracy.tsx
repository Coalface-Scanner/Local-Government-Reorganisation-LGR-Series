import TopicHub from '../../components/TopicHub';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';

interface DemocracyProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function Democracy({ onNavigate }: DemocracyProps) {
  return (
    <>
      <SEOHead page="topicsDemocracy" />
      <MetaTags
        title="Democracy - Thought Leadership Hub"
        description="Research on democratic legitimacy, representation, and accountability in local government. Examining how reorganisation affects community voice and political participation."
        keywords="democracy, democratic legitimacy, representation, accountability, local democracy"
      />
      <TopicHub
        themeName="Democracy"
        themeSlug="democracy"
        description="Research on democratic legitimacy, representation, and accountability in local government. Examining how reorganisation affects community voice, political participation, and the relationship between citizens and their representatives."
        keyQuestion="What does democratic legitimacy mean in the context of local government reorganisation, and how can it be strengthened?"
        relatedThemes={[
          { name: 'Local Government', slug: 'local-government' },
          { name: 'Governance & Accountability', slug: 'governance-accountability' },
        ]}
        onNavigate={onNavigate}
      />
    </>
  );
}
