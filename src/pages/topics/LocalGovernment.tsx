import TopicHub from '../../components/TopicHub';
import MetaTags from '../../components/MetaTags';

interface LocalGovernmentProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function LocalGovernment({ onNavigate }: LocalGovernmentProps) {
  return (
    <>
      <MetaTags
        title="Local Government - Thought Leadership Hub"
        description="Expert analysis on local government reorganisation, council reform, and governance structures. Evidence-led research on how local authorities are reshaping decision-making."
        keywords="local government, council reform, governance, reorganisation, unitary authorities"
      />
      <TopicHub
        themeName="Local Government"
        themeSlug="local-government"
        description="Expert analysis on local government reorganisation, council reform, and governance structures. Evidence-led research examining how local authorities are reshaping decision-making, accountability, and service delivery across England."
        keyQuestion="How can local government reorganisation strengthen democratic accountability while improving service delivery?"
        relatedThemes={[
          { name: 'Democracy', slug: 'democracy' },
          { name: 'Governance & Accountability', slug: 'governance-accountability' },
        ]}
        onNavigate={onNavigate}
      />
    </>
  );
}
