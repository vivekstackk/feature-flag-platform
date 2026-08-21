import { Pool } from 'pg';

export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  changes: Record<string, unknown>;
  createdAt: string;
}

interface AuditRow {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: Record<string, unknown>;
  created_at: Date;
}

function rowToEntry(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    changes: row.changes,
    createdAt: row.created_at.toISOString(),
  };
}

export class AuditStore {
  constructor(private pool: Pool) {}

  async log(entry: {
    entityType: string;
    entityId: string;
    action: string;
    changes: Record<string, unknown>;
  }): Promise<void> {
    await this.pool.query(
      `INSERT INTO audit_log (entity_type, entity_id, action, changes) VALUES ($1, $2, $3, $4)`,
      [entry.entityType, entry.entityId, entry.action, JSON.stringify(entry.changes)]
    );
  }

  async getByEntity(entityType: string, entityId: string): Promise<AuditEntry[]> {
    const result = await this.pool.query<AuditRow>(
      `SELECT * FROM audit_log WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC`,
      [entityType, entityId]
    );
    return result.rows.map(rowToEntry);
  }

  async getAll(limit: number = 50): Promise<AuditEntry[]> {
    const result = await this.pool.query<AuditRow>(
      `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows.map(rowToEntry);
  }
}
