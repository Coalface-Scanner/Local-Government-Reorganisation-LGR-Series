import { Link } from 'react-router-dom';
import { Mail, Linkedin, Phone } from 'lucide-react';

export default function NewsletterFooter() {
  return (
    <div className="mt-16 border-t border-academic-neutral-200 pt-12 space-y-10 print:mt-8">

      {/* Get Involved */}
      <section>
        <h2 className="text-academic-lg font-display font-bold text-academic-charcoal mb-4">
          Get Involved
        </h2>
        <p className="text-academic-neutral-700 font-serif leading-relaxed mb-4">
          The LGR Initiative is a practical, evidence-led contribution to the national debate on
          structural reform and democratic renewal. We welcome insights from councillors, officers,
          practitioners, researchers and residents with direct experience of reorganisation,
          devolution or related governance reform.
        </p>
        <p className="text-academic-neutral-700 font-serif leading-relaxed mb-6">
          If you would like to suggest case studies, share data or discuss specific transition
          arrangements, please get in touch. Contributions can be treated in confidence and used to
          inform research outputs, including the 100 Days Playbook, Governance Toolkit and
          forthcoming White Paper.
        </p>
        <div className="flex flex-wrap gap-4 text-academic-sm font-display">
          <a
            href="mailto:editor@localgovernmentreorganisation.com"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 transition-colors font-medium"
          >
            <Mail size={15} />
            editor@localgovernmentreorganisation.com
          </a>
          <a
            href="https://www.linkedin.com/showcase/local-government-reorganisation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 transition-colors font-medium"
          >
            <Linkedin size={15} />
            Connect via LinkedIn
          </a>
          <a
            href="tel:02071237056"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 transition-colors font-medium"
          >
            <Phone size={15} />
            020 7123 7056
          </a>
        </div>
      </section>

      {/* About the LGR Initiative */}
      <section className="bg-academic-warm rounded-xl p-6 border border-academic-neutral-200">
        <h2 className="text-academic-lg font-display font-bold text-academic-charcoal mb-4">
          About the LGR Initiative
        </h2>
        <p className="text-academic-neutral-700 font-serif leading-relaxed mb-4">
          The LGR Initiative places decision-makers and affected communities at the centre of
          structural reform. It provides clear, evidence-led analysis of how reorganisation,
          devolution and electoral change operate in practice — and what they mean for
          representation, accountability and service delivery. Its purpose is to support informed,
          constructive debate at a pivotal moment of institutional change across England.
        </p>
        <p className="text-academic-neutral-700 font-serif leading-relaxed mb-4">
          The Initiative is delivered by{' '}
          <a
            href="https://coalfaceengagement.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-800 font-medium"
          >
            COALFACE
          </a>{' '}
          in partnership with the Centre for Britain and Europe at the University of Surrey,
          combining practitioner insight with academic rigour to examine governance design,
          democratic legitimacy and the practical delivery of reform. ECF, Commonplace and Truth
          About Local Government are also partners in the Initiative.
        </p>
        <p className="text-academic-sm text-academic-neutral-600 font-serif mb-4">
          The Initiative is intended for councillors, officers, policymakers, developers and
          advisers navigating the transition to new unitary and mayoral structures, and for those
          shaping the future of English devolution.
        </p>
        <Link
          to="/about/partnership"
          className="text-academic-sm font-display font-medium text-teal-700 hover:text-teal-800 transition-colors"
        >
          Learn more about our partners →
        </Link>
      </section>

      {/* Disclaimer */}
      <section className="text-academic-sm text-academic-neutral-500 font-serif leading-relaxed border-t border-academic-neutral-200 pt-8">
        <p className="mb-3">
          <strong className="font-display text-academic-neutral-600">Disclaimer:</strong> Content
          is provided for general information only and does not constitute technical, planning,
          legal or professional advice. Coalface Engagement Ltd accepts no liability for decisions
          taken on the basis of this material. For advice relating to specific authorities, schemes
          or governance arrangements, please{' '}
          <a
            href="mailto:editor@localgovernmentreorganisation.com"
            className="text-teal-700 hover:text-teal-800"
          >
            contact us directly
          </a>
          .
        </p>
        <p className="mb-3">
          Published by Coalface Engagement Ltd — the incorporated entity for all COALFACE branded
          consultancy services, including COALFACE Council Scanner, COALFACE Insights and COALFACE
          Engagement. Registered in England and Wales. Company number{' '}
          <a
            href="https://find-and-update.company-information.service.gov.uk/company/11741464"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:text-teal-800"
          >
            11741464
          </a>
          . Registered office: Prebend House, 72 London Road, Leicester, LE2 0QR.
        </p>
        <p>© Coalface Engagement Ltd 2026. All rights reserved.</p>
      </section>

    </div>
  );
}
