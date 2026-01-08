import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables from .env file
function loadEnv() {
  const envPath = join(projectRoot, '.env');
  if (!existsSync(envPath)) {
    throw new Error('.env file not found!');
  }
  
  const envContent = readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Article data
const article = {
  title: "From Structure to Authority: Why Reorganisation Only Works When Governance Is Taken Seriously",
  slug: "from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously",
  excerpt: "An interview with Robert Moran, Chief Executive, Elmbridge (2007-2022). Local Government Reorganisation is often framed as a structural exercise: boundaries change, councils merge and committees are reshaped. But reorganisation only improves outcomes when it is treated as a test of leadership and when lines of authority are set early, clearly and enforced consistently.",
  body: `<p><strong>Robert Moran, was a senior local government leader and adviser with extensive experience of council governance, organisational leadership and public service reform. He served as Chief Executive of Elmbridge Borough Council from 2007 to 2022, leading the authority through a prolonged period of strong performance, organisational stability and cultural change, including the development of a widely recognised compassionate council approach. Prior to this, he held senior roles at Elmbridge as Assistant Chief Executive and at the London Borough of Merton as Head of Regeneration. Since retiring from executive office, he has worked as a consultant and mentor to senior public sector leaders through Morcliffe Consulting Ltd, advising on governance, leadership and organisational change during periods of reform and transition.</strong></p>

<h2>A test of leadership</h2>

<p>Local Government Reorganisation is often framed as a structural exercise: boundaries change, councils merge and committees are reshaped. Structure matters. But Moran's concluding lesson is that reorganisation only improves outcomes when it is treated as a test of leadership and when lines of authority are set early, clearly and enforced consistently. Surrey County Council Leader, Tim Oliver argued for scale and power; Former Councillor, Andrew Kelly and Former Buckinghamshire Planning Service Director, Eric Owens warned of the operational and digital realities. Moran brings those strands together and identifies the concrete governance choices that determine whether reorganisation delivers or merely enlarges dysfunction.</p>

<h2>Why governance matters: the political and financial reality</h2>

<p>Moran is explicit about the driver beneath the rhetoric of reform. Central government has not resolved local government finance; demand-led services dominate budgets.</p>

<blockquote>
<p><strong>"The cake is already the size of the cake, and there won't be another cake, or a bigger cake"</strong></p>
</blockquote>

<p>Reorganisation therefore becomes a pragmatic device to generate capacity from within.</p>

<p>The lesson here is to treat reorganisation as a leadership challenge, not a spreadsheet fix. Recent reorganisations show the point. Dorset's planning performance remains constrained six years on while legacy Local Plans and inherited systems continue to determine major applications; Cumberland and Westmorland and Furness began life under immediate financial pressure and required Exceptional Financial Support. These examples underline Moran's warning: cleaner governance on paper will not deliver better services unless backed by disciplined, resourced implementation.</p>

<h2>Practical levers: delegation, operational honesty and culture</h2>

<p>Moran identifies three operational levers that convert structure into authority.</p>

<p><strong>Delegation.</strong> Councils too often exhaust political capital on routine matters that should never reach members. Moran is blunt:</p>

<blockquote>
<p><strong>"We don't half make heavy weather of some very basic decisions… What business would make in a nanosecond, we scratch our heads over for many happy hours."</strong></p>
</blockquote>

<p>He adds that councillors waste time "arguing over bin stores and the colour of wheelie bins" instead of making strategic decisions on housing and infrastructure. The lesson is direct: remove routine operational choices from member committees quickly so elected members can focus on strategic, value-adding decisions.</p>

<p><strong>Operational honesty.</strong> Promising instant systems integration undermines staff trust. Moran's realism is decisive:</p>

<blockquote>
<p><strong>"Quite a lot of this, given the timescale, is going to have to be lift and drop… I'd say it's five years from vesting day before you get anything that looks integrated."</strong></p>
</blockquote>

<p>Be candid with staff and the public about interim arrangements, set a realistic integration timetable, and provide reliable short-term arrangements to maintain confidence.</p>

<p><strong>Culture and communications.</strong> New unitaries must be <em>"culturally entirely different new organisations,"</em> not federations of legacy councils. Moran offers a clear test of success: the resident experience. He asks, "<em>as a householder planning applicant, who do I phone up the day after vesting day about the progress on my application?</em>" The practical imperative follows: resource customer services as critical infrastructure and run repetitive, simple communications so residents always know where to turn.</p>

<p>The lesson is delegation, candour about operations and early culture change are the mechanisms through which structure becomes authority.</p>

<h2>Modernisation as the only credible route to capacity</h2>

<p>Running through Moran's critique is a harder reality: reorganisation cannot create capacity unless councils are prepared to modernise how they work. If there is no prospect of additional funding, the only way to generate internal resource is through process reform, even greater efficiency and sharper prioritisation.</p>

<blockquote>
<p><strong>"The key way to create additional resources from within the sector will be to modernise processes and reengineer priorities, taking five steps rather than one, to be radical and ruthless in focusing on what residents want and what service standards we can afford. Ultimately, community and individual safety must be the bedrock."</strong></p>
</blockquote>

<p>That requires councils to leapfrog beyond incremental change. Moran's point is not about efficiency theatre (renaming teams, transformation that is little more than rebranding and the like), but about being willing to take those "<em>five steps rather than one</em>". It is to <em>reengineer</em> processes, simplify decision pathways and be driven in doing what residents actually value and what service standards are realistically affordable. Making heavy weather of routine decisions is not merely cultural; it is a failure to modernise systems and workflows that should already have been addressed.</p>

<p>The implication is clear. Without radical process modernisation, reorganisation risks hard-wiring existing inefficiencies into larger institutions. Governance reform must therefore sit alongside a clear programme of operational change, grounded in resident outcomes and fiscal reality.</p>

<p>As Moran states, community and individual safety, particularly in safeguarding and statutory services, must remain the non-negotiable "<em>bedrock</em>" around which all modernisation decisions are taken. In these areas, governance failure has immediate human consequences, and cannot be mitigated by systems alone.</p>

<p>The relationship between governance reform and genuine modernisation is a theme we will return to in a future article.</p>

<h2>Risk, human stakes, evidence and immediate priorities</h2>

<p>Moran stresses that governance failure is not merely bureaucratic. He deliberately contrasts routine garden-variety disputes with services where failure has immediate human consequences. "The at risk register, for example: kids can die," he warns, and he is equally stark about the legal and moral consequences:</p>

<blockquote>
<p><strong>"If you drop the ball with social work, you're in jail, and somebody's died."</strong></p>
</blockquote>

<p>These are not rhetorical flourishes. They frame reorganisation as a moral as well as an operational problem: safeguarding and statutory social work must be preserved through transition.</p>

<p>The independent review of Northumberland put the point plainly: the council had "lost its way", describing a dysfunctional organisation, a "climate of fear and intimidation" and a culture "promoting suspicion and mistrust". The review also records that the Interim Executive Director of Resources issued an s.114 determination that the council had "committed unlawful expenditure" in relation to international trading activity.</p>

<p>They frame reorganisation as a moral as well as an operational problem: safeguarding and statutory social work must be preserved through transition.</p>

<p>Evidence from other reorganisations supports that warning. Dorset's experience shows persistent planning backlogs and a patchwork of legacy Local Plans years after unitarisation, undermining the promise of faster, more predictable decision-making; Northumberland's independent governance review identified a negative culture and senior tensions that damaged decision-making and led to unlawful spending;</p>

<p>Cumbria's new councils assumed wide strategic responsibilities but entered life under immediate fiscal pressure, requiring external assurance and Exceptional Financial Support. These cases make concrete what Moran's human-stakes language implies: governance disruption, systems fragmentation and capacity gaps translate directly into visible service failure and, in some services, serious harm.</p>

<p>A further lesson is that of continuity for critical services — especially children's and adult social care — is non-negotiable. Protect statutory teams, ring-fence expertise, and publish clear continuity plans that show where responsibility sits and how urgent cases will be handled on day one and beyond.</p>

<h2>Immediate priorities for shadow and new authorities</h2>

<ul>
<li><strong>Appoint and publish.</strong> Appoint the chief executive and shadow leader within the first month and publish a simple accountability map showing who is accountable for each statutory and operational function.</li>
<li><strong>Secure the resident experience for vesting day.</strong> Publish and resource a "Who do I phone on day one?" plan and staff the signposting/customer-service function to resolve the majority of queries.</li>
<li><strong>Delegate quickly.</strong> Implement a six-month delegation schedule to remove routine operational decisions from member committees so councillors can focus on strategic choices.</li>
</ul>

<h2>The Key Takeaway?</h2>

<p>Local Government Reorganisation is a test of leadership, not a technical tick-box. Councils that treat it as structural tidy-up will struggle. Councils that redraw authority, enforce delegation and set a disciplined culture from the outset have a chance to emerge stronger.</p>

<p>Lines on a map do not deliver homes, infrastructure or trust.</p>

<p>Clear lines of authority do.</p>

<h2>Q&A: The Governance Reality Check</h2>

<h3>Q: Is Local Government Reorganisation actually about better services, or is it just about saving money?</h3>
<p><strong>A:</strong> Moran argues that with demand-led services like Adult Social Care and SEND consuming ever-larger portions of the budget, and no new funding coming from central government, LGR is a mechanism to generate capacity from within. As he puts it: <em>"The cake is already the size of the cake. There won't be another cake."</em>. The goal is to strip out the cost of duplication to protect the frontline.</p>

<h3>Q: Why does the "Lame Duck" period create such specific risks for planning applications?</h3>
<p><strong>A:</strong> The risk is the loss of political discipline. Moran explains that in a stable council, a leader can deliver a vote because the group is disciplined. In the 18–24 month transition, councillors who know they are losing their seats have no incentive to follow the whip or officer advice. This leads to "hesitation" and "paralysis" exactly when decisiveness is needed, creating an environment where <em>"anything could happen"</em> at committee.</p>

<h3>Q: How much danger of "Bin Store" politics is there for a new Unitary Authority?</h3>
<p><strong>A:</strong> This is Moran's metaphor for the failure to delegate. The promise of a Unitary Authority is strategic scale—making decisions about infrastructure and housing delivery across a massive geography. However, if the Scheme of Delegation is not ruthless, councillors will retreat into the comfort zone of minor details. Moran warns: <em>"We don't half make heavy weather of some very basic decisions... arguing over bin stores and the colour of wheelie bins"</em>. If a Unitary works at that level of detail, the planning system will grind to a halt.</p>

<h3>Q: How realistic is the "Digital Transformation" often promised in LGR business cases?</h3>
<p><strong>A:</strong> Moran is candid that on Vesting Day, the reality will be <em>"lift and drop"</em>—migrating existing legacy systems rather than launching new ones. He estimates it takes closer to <em>"five years"</em> to achieve genuine integration. The operational risk lies in leadership pretending otherwise; telling staff they are entering a new era while they are staring at the same old screens breeds cynicism.</p>

<h3>Q: What is the "Who Do I Call?" test?</h3>
<p><strong>A:</strong> This is the immediate measure of success for residents. While governance diagrams might look tidy, the public experience is often one of confusion. Moran argues that if a resident in crisis calls a number that no longer works, or cannot find the right department, confidence evaporates instantly. For developers and agents, this means the first few months are often defined by a breakdown in communication channels rather than policy changes.</p>

<h3>Q: Why do you describe governance as a "matter of life and death"?</h3>
<p><strong>A:</strong> Because local government is the safety net for society's most vulnerable. Moran argues that we often get distracted by the administrative process of merging contracts and drawing maps. But if that process causes paralysis or hesitation, real people fall through the gaps. Whether it is housing safety, social care, or mental health support, a failure of governance during transition can have catastrophic human consequences.</p>

<h3>Q: Should we expect a mass exodus of staff during the transition?</h3>
<p><strong>A:</strong> You should plan for it. Moran estimates that roughly half the workforce will see LGR as an opportunity for career progression in a larger organisation, while the other half will look to exit via early retirement or lateral moves. This "churn" is a feature of reorganisation, not a bug, but it poses a severe risk to planning departments that are already struggling with recruitment.</p>`,
  status: 'published',
  published_date: '2026-01-08T00:00:00Z',
  author: 'Rowan @ Coalface™',
  category: 'Analysis',
  region: 'England',
  featured: false
};

async function addArticle() {
  try {
    console.log('📝 Adding article to database...');
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);

    // Check if article already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id, title')
      .eq('slug', article.slug)
      .maybeSingle();

    if (existing) {
      console.log('⚠️  Article already exists! Updating...');
      const { data, error } = await supabase
        .from('articles')
        .update(article)
        .eq('slug', article.slug)
        .select();

      if (error) throw error;
      console.log('✅ Article updated successfully!');
      console.log(`ID: ${data[0].id}`);
    } else {
      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select();

      if (error) throw error;
      console.log('✅ Article added successfully!');
      console.log(`ID: ${data[0].id}`);
    }

    console.log('\n🎉 Done! Article is now in the insights section.');
    console.log(`URL: /insights/${article.slug}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

addArticle();

