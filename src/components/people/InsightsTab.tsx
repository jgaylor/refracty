'use client';

import { useState } from 'react';
import { Insight, InsightCategory } from '@/lib/supabase/insights';
import { InsightSection } from './InsightSection';

interface InsightsTabProps {
  personId: string;
  initialInsights: Insight[];
}

const CATEGORY_LABELS: Record<InsightCategory, string> = {
  motivated_by: 'Motivated by:',
  preferred_communication: 'Preferred communication:',
  works_best_when: 'Works best when:',
  collaboration_style: 'Collaboration style:',
  feedback_approach: 'Feedback approach:',
};

const ALL_CATEGORIES: InsightCategory[] = [
  'motivated_by',
  'preferred_communication',
  'works_best_when',
  'collaboration_style',
  'feedback_approach',
];

export function InsightsTab({ personId, initialInsights }: InsightsTabProps) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [loading, setLoading] = useState(false);

  // Group insights by category
  const insightsByCategory = insights.reduce((acc, insight) => {
    if (!acc[insight.category]) {
      acc[insight.category] = [];
    }
    acc[insight.category].push(insight);
    return acc;
  }, {} as Record<InsightCategory, Insight[]>);

  const handleAdd = async (category: InsightCategory, content: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          content,
          person_id: personId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Optimistically add the new insight
        setInsights((prev) => [...prev, result.insight]);
      } else {
        throw new Error(result.error || 'Failed to add insight');
      }
    } catch (error) {
      console.error('Error adding insight:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string, content: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/insights/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Optimistically update the insight
        setInsights((prev) =>
          prev.map((insight) => (insight.id === id ? result.insight : insight))
        );
      } else {
        throw new Error(result.error || 'Failed to update insight');
      }
    } catch (error) {
      console.error('Error updating insight:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people/${personId}/insights/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Optimistically remove the insight
        setInsights((prev) => prev.filter((insight) => insight.id !== id));
      } else {
        throw new Error(result.error || 'Failed to delete insight');
      }
    } catch (error) {
      console.error('Error deleting insight:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {ALL_CATEGORIES.map((category) => (
        <InsightSection
          key={category}
          category={category}
          categoryLabel={CATEGORY_LABELS[category]}
          insights={insightsByCategory[category] || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

