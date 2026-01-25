import TopicHub from '../../components/TopicHub';
import MetaTags from '../../components/MetaTags';

interface GovernanceAndReformProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function GovernanceAndReform({ onNavigate }: GovernanceAndReformProps) {
  return (
    <>
      <MetaTags
        title="Governance and Reform - Thought Leadership Hub"
        description="Reorganisation promises simpler structures, clearer accountability and better performance. In practice, it often exposes how fragile governance arrangements can be during transition."
        keywords="governance, reform, local government reorganisation, accountability, planning performance, decision making"
      />
      <TopicHub
        themeName="Local Government"
        displayName="Governance and Reform"
        themeSlug="governance-and-reform"
        onNavigate={onNavigate}
      />
    </>
  );
}
