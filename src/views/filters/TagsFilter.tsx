import React from 'react';
import { cn } from '@/lib/utils';
import { Tag } from '@/models';

interface Props {
    tags: Tag[]; // Available unique tags
    selectedTags: string[]; // Selected tag slugs
    onSelectTags: (tags: string[]) => void;
}

export function TagsFilter({ tags, selectedTags, onSelectTags }: Props) {

    const handleTagToggle = (slug: string) => {
        if (selectedTags.includes(slug)) {
            onSelectTags(selectedTags.filter(s => s !== slug));
        } else {
            onSelectTags([...selectedTags, slug]);
        }
    };

    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 max-w-xs">
            {tags.map(tag => {
                const isSelected = selectedTags.includes(tag.slug);
                return (
                    <button
                        key={tag.slug}
                        onClick={() => handleTagToggle(tag.slug)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all shadow-sm border",
                            isSelected
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                        )}
                    >
                        {tag.name}
                    </button>
                );
            })}
        </div>
    );
}
