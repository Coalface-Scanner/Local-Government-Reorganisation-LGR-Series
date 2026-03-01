import { SEOHead } from '../../components/SEOHead';
import About from './About';

interface AboutOverviewProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function AboutOverview({ onNavigate }: AboutOverviewProps) {
  return (
    <>
      <SEOHead page="aboutOverview" />
      <About onNavigate={onNavigate} />
    </>
  );
}
