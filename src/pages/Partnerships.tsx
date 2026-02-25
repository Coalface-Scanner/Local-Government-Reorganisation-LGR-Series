import { Link, useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';

export default function Partnerships() {
  const location = useLocation();

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Partnerships - LGR Initiative"
        description="The LGR Initiative was formed by a partnership between Coalface Engagement Ltd and the Centre for Britain and Europe, University of Surrey, along with others."
        keywords="LGR Initiative partnerships, Coalface Engagement, Centre for Britain and Europe, University of Surrey"
      />
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Partnerships"
        heroSubtitle="The LGR Initiative was formed by a partnership between Coalface Engagement Ltd and the Centre for Britain and Europe, University of Surrey, along with others."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <section className="academic-card p-8 max-w-3xl">
          <div className="academic-prose space-y-4">
            <p>
              The LGR Initiative was formed by a partnership between Coalface Engagement Ltd and the Centre for Britain and Europe, University of Surrey, along with others.
            </p>
            <p>
              This collaboration brings together expertise in local government, public policy, and research to deliver independent analysis of local government reorganisation and its implications for planning, governance, and development delivery across England.
            </p>
            <p>
              <a
                href="https://www.coalfaceengagement.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 font-display font-bold transition-colors underline"
              >
                Coalface Engagement Ltd
              </a>
              {' · '}
              <a
                href="https://www.surrey.ac.uk/centre-britain-europe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 font-display font-bold transition-colors underline"
              >
                Centre for Britain and Europe, University of Surrey
              </a>
            </p>
            <p>
              <Link to="/about" className="text-teal-700 hover:text-teal-800 font-display font-bold transition-colors underline">
                Return to About
              </Link>
            </p>
          </div>
        </section>
      </div>
      <FAQSection page="partnerships" />
    </div>
  );
}
