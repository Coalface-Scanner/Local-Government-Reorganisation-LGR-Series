import About from './About';

interface AboutHubProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function AboutHub({ onNavigate }: AboutHubProps) {
  return <About onNavigate={onNavigate} />;
}
