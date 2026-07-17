import { Pool } from 'pg';
import { CreateSegmentInput, Segment, SegmentCondition } from './types';

interface SegmentRow {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  created_at: Date;
  updated_at: Date;
}

function rowToSegment(row: SegmentRow): Segment {
  return {
    id: row.id,
    name: row.name,
    conditions: row.conditions,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export class SegmentStore {
  constructor(private pool: Pool) {}

  async create(input: CreateSegmentInput): Promise<Segment> {
    try {
      const result = await this.pool.query<SegmentRow>(
        `INSERT INTO segments (name, conditions) VALUES ($1, $2) RETURNING *`,
        [input.name, JSON.stringify(input.conditions)]
      );
      return rowToSegment(result.rows[0]);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new Error(`Segment with name "${input.name}" already exists`);
      }
      throw err;
    }
  }

  async getByName(name: string): Promise<Segment | undefined> {
    const result = await this.pool.query<SegmentRow>('SELECT * FROM segments WHERE name = $1', [name]);
    return result.rows[0] ? rowToSegment(result.rows[0]) : undefined;
  }

  async getAll(): Promise<Segment[]> {
    const result = await this.pool.query<SegmentRow>('SELECT * FROM segments ORDER BY created_at');
    return result.rows.map(rowToSegment);
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM segments WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      if ((err as { code?: string }).code === '22P02') {
        return false;
      }
      throw err;
    }
  }
}