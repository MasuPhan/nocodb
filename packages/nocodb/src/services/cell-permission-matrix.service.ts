import { Injectable } from '@nestjs/common';
import { PermissionKey, PermissionRole } from 'nocodb-sdk';
import type { NcContext } from '~/interface/config';
import { MetaService } from '~/meta/meta.service';
import { MetaTable } from '~/utils/globals';

export type CellAccessFlag = 'view' | 'edit' | 'none';

@Injectable()
export class CellPermissionMatrixService {
  constructor(private readonly metaService: MetaService) {}

  async setPermission(
    context: NcContext,
    params: {
      rowId: string;
      columnId: string;
      role: PermissionRole;
      permission: PermissionKey | string;
    },
  ) {
    await this.metaService.metaDelete(
      context.workspace_id,
      context.base_id,
      MetaTable.PERMISSIONS,
      {
        row_id: params.rowId,
        column_id: params.columnId,
        granted_role: params.role,
        permission: params.permission,
      },
    );

    return this.metaService.metaInsert2(
      context.workspace_id,
      context.base_id,
      MetaTable.PERMISSIONS,
      {
        fk_workspace_id: context.workspace_id,
        base_id: context.base_id,
        entity: 'cell',
        entity_id: `${params.rowId}:${params.columnId}`,
        row_id: params.rowId,
        column_id: params.columnId,
        permission: params.permission,
        granted_type: 'role',
        granted_role: params.role,
      },
    );
  }

  async deletePermission(context: NcContext, id: string) {
    return this.metaService.metaDelete(
      context.workspace_id,
      context.base_id,
      MetaTable.PERMISSIONS,
      id,
    );
  }

  async getCellAccess(
    context: NcContext,
    params: { rowId: string; columnId: string; role: PermissionRole },
  ): Promise<CellAccessFlag> {
    const perms = await this.metaService.metaList2(
      context.workspace_id,
      context.base_id,
      MetaTable.PERMISSIONS,
      {
        condition: {
          row_id: params.rowId,
          column_id: params.columnId,
          granted_role: params.role,
        },
      },
    );

    const hasEdit = perms.some(
      (p) => p.permission === PermissionKey.RECORD_FIELD_EDIT || p.permission === 'EDIT',
    );
    if (hasEdit) return 'edit';

    const hasView = perms.some((p) => p.permission === 'VIEW');
    if (hasView) return 'view';

    return 'none';
  }
}
