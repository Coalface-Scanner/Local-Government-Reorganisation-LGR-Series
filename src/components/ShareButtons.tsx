import { Mail, Facebook, Linkedin, Twitter, Link2, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url: string;
}

export default function ShareButtons({ title, description, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  // Use description for social shares if available, otherwise use title
  const shareText = description && description !== title ? description : title;
  const encodedShareText = encodeURIComponent(shareText);
  
  const shareLinks = {
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription || encodedTitle}%0A%0A${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedShareText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedShareText}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (_err) {
      alert('Failed to copy link. Please try again.');
    }
  };

  const shareButtons = [
    {
      name: 'Email',
      icon: Mail,
      href: shareLinks.email,
      color: 'hover:bg-slate-100 hover:text-slate-700',
      action: 'link'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: shareLinks.facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      action: 'link'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: shareLinks.linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      action: 'link'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: shareLinks.twitter,
      color: 'hover:bg-sky-500 hover:text-white',
      action: 'link'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: shareLinks.whatsapp,
      color: 'hover:bg-green-500 hover:text-white',
      action: 'link'
    },
    {
      name: 'Copy Link',
      icon: Link2,
      href: '#',
      color: 'hover:bg-cyan-600 hover:text-white',
      action: 'copy'
    },
  ];

  const displayTitle = title.includes('Election Simulator') ? 'Share Election Results' : 'Share this article';

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
      <h3 className="font-bold text-slate-900 mb-4">{displayTitle}</h3>
      <div className="flex flex-wrap gap-3">
        {shareButtons.map((button) => {
          const Icon = button.icon;

          if (button.action === 'copy') {
            return (
              <button
                key={button.name}
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg transition-colors text-slate-700 ${button.color}`}
                title={button.name}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{button.name}</span>
              </button>
            );
          }

          return (
            <a
              key={button.name}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg transition-colors text-slate-700 ${button.color}`}
              title={`Share on ${button.name}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{button.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
