import TopicHub from '../../components/TopicHub';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';

interface DemocraticLegitimacyProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function DemocraticLegitimacy({ onNavigate }: DemocraticLegitimacyProps) {
  return (
    <>
      <SEOHead page="topicsDemocraticLegitimacy" />
      <MetaTags
        title="Democratic Legitimacy - Thought Leadership Hub"
        description="Local Government Reorganisation changes more than administrative boundaries. It alters who is represented, how visible decision makers are, and how much confidence communities place in the outcomes councils deliver."
        keywords="democratic legitimacy, representation, electoral systems, institutional design, public trust, local democracy"
      />
      <TopicHub
        themeName="Democratic Legitimacy"
        displayName="Democratic Legitimacy"
        themeSlug="democratic-legitimacy"
        onNavigate={onNavigate}
      />
    </>
  );
}
