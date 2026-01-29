import { useState, useEffect, useCallback } from 'react';
import { Link, Plus, X, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content_type: string | null;
  source_type: 'articles' | 'materials' | 'news';
}

interface ContentRelationship {
  id: string;
  source_type: 'articles' | 'materials' | 'news';
  source_id: string;
  target_type: 'articles' | 'materials' | 'news';
  target_id: string;
  relationship_type: 'related' | 'see_also' | 'parent' | 'child' | 'depends_on';
  display_order: number;
}

interface ContentRelationshipsProps {
  sourceType: 'articles' | 'materials' | 'news';
  sourceId: string;
  onRelationshipsChange?: (relationships: ContentRelationship[]) => void;
}

export default function ContentRelationships({
  sourceType,
  sourceId,
  onRelationshipsChange,
}: ContentRelationshipsProps) {
  const [relationships, setRelationships] = useState<ContentRelationship[]>([]);
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState<'articles' | 'materials' | 'news'>('articles');
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<'related' | 'see_also' | 'parent' | 'child' | 'depends_on'>('related');

  const fetchRelationships = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('content_relationships')
        .select('*')
        .or(`and(source_type.eq.${sourceType},source_id.eq.${sourceId}),and(target_type.eq.${sourceType},target_id.eq.${sourceId})`)
        .order('display_order');

      if (error) throw error;
      setRelationships(data || []);
      if (onRelationshipsChange) {
        onRelationshipsChange(data || []);
      }
    } catch (err) {
      console.error('Error fetching relationships:', err);
    }
  }, [sourceType, sourceId, onRelationshipsChange]);

  const fetchAvailableContent = useCallback(async () => {
    try {
      const allContent: ContentItem[] = [];

      // Fetch articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, content_type')
        .eq('status', 'published')
        .limit(100);

      if (articles) {
        allContent.push(...articles.map(a => ({ ...a, source_type: 'articles' as const })));
      }

      // Fetch materials
      const { data: materials } = await supabase
        .from('materials')
        .select('id, title, slug, content_type')
        .eq('status', 'published')
        .limit(100);

      if (materials) {
        allContent.push(...materials.map(m => ({ ...m, source_type: 'materials' as const })));
      }

      // Fetch news
      const { data: news } = await supabase
        .from('news')
        .select('id, title, slug')
        .eq('status', 'published')
        .limit(100);

      if (news) {
        allContent.push(...news.map(n => ({ ...n, content_type: null, source_type: 'news' as const })));
      }

      // Filter out current item
      const filtered = allContent.filter(item => 
        !(item.source_type === sourceType && item.id === sourceId)
      );

      setAvailableContent(filtered);
    } catch (err) {
      console.error('Error fetching available content:', err);
    }
  }, [sourceId, sourceType]);

  useEffect(() => {
    if (sourceId) {
      fetchRelationships();
      fetchAvailableContent();
    }
  }, [sourceId, sourceType, fetchRelationships, fetchAvailableContent]);

  const addRelationship = async (targetId: string, targetType: 'articles' | 'materials' | 'news') => {
    try {
      const { error } = await supabase
        .from('content_relationships')
        .insert({
          source_type: sourceType,
          source_id: sourceId,
          target_type: targetType,
          target_id: targetId,
          relationship_type: selectedRelationshipType,
          display_order: relationships.length,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchRelationships();
      setShowAddDialog(false);
      setSearchQuery('');
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code !== '23505') { // Ignore duplicate key errors
        alert('Failed to add relationship: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const removeRelationship = async (relationshipId: string) => {
    try {
      const { error } = await supabase
        .from('content_relationships')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;
      await fetchRelationships();
    } catch (_err) {
      alert('Failed to remove relationship');
    }
  };

  const getRelatedItem = (relationship: ContentRelationship): ContentItem | null => {
    const isSource = relationship.source_type === sourceType && relationship.source_id === sourceId;
    const targetType = isSource ? relationship.target_type : relationship.source_type;
    const targetId = isSource ? relationship.target_id : relationship.source_id;

    return availableContent.find(
      item => item.source_type === targetType && item.id === targetId
    ) || null;
  };

  const filteredContent = availableContent.filter(item => {
    if (searchQuery.trim()) {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return item.source_type === selectedTargetType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Related Content</h4>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Relationship
        </button>
      </div>

      {relationships.length > 0 ? (
        <div className="space-y-2">
          {relationships.map((rel) => {
            const item = getRelatedItem(rel);
            if (!item) return null;

            return (
              <div
                key={rel.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Link className="w-4 h-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{item.source_type}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{rel.relationship_type}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeRelationship(rel.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove relationship"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No related content</p>
      )}

      {showAddDialog && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => {
              setShowAddDialog(false);
              setSearchQuery('');
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 min-w-[500px] max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Related Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relationship Type</label>
                <select
                  value={selectedRelationshipType}
                  onChange={(e) => setSelectedRelationshipType(e.target.value as 'related' | 'see_also' | 'parent' | 'child' | 'depends_on')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="related">Related</option>
                  <option value="see_also">See Also</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="depends_on">Depends On</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
                <select
                  value={selectedTargetType}
                  onChange={(e) => setSelectedTargetType(e.target.value as 'articles' | 'materials' | 'news')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="articles">Articles</option>
                  <option value="materials">Materials</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or slug..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                {filteredContent.length > 0 ? (
                  <div className="divide-y divide-slate-200">
                    {filteredContent.map((item) => (
                      <button
                        key={`${item.source_type}-${item.id}`}
                        onClick={() => addRelationship(item.id, item.source_type)}
                        className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.source_type} • {item.slug}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-slate-500 text-center">No content found</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
