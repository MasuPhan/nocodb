import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionKey, PermissionRole } from 'nocodb-sdk';
import { Acl } from '~/middlewares/extract-ids/extract-ids.middleware';
import { GlobalGuard } from '~/guards/global/global.guard';
import { TenantContext } from '~/decorators/tenant-context.decorator';
import type { NcContext } from '~/interface/config';
import { CellPermissionMatrixService } from '~/services/cell-permission-matrix.service';

@Controller()
@UseGuards(GlobalGuard)
export class CellPermissionMatrixController {
  constructor(private readonly service: CellPermissionMatrixService) {}

  @Post('/api/v1/db/meta/cell-permissions')
  @Acl('cellPermissionSet')
  async setPermission(
    @TenantContext() context: NcContext,
    @Body()
    body: { rowId: string; columnId: string; role: PermissionRole; permission: PermissionKey | string },
  ) {
    return this.service.setPermission(context, body);
  }

  @Get('/api/v1/db/meta/cell-permissions')
  @Acl('cellPermissionGet')
  async getPermission(
    @TenantContext() context: NcContext,
    @Query('rowId') rowId: string,
    @Query('columnId') columnId: string,
    @Query('role') role: PermissionRole,
  ) {
    return this.service.getCellAccess(context, { rowId, columnId, role });
  }

  @Delete('/api/v1/db/meta/cell-permissions/:id')
  @Acl('cellPermissionDelete')
  async deletePermission(@TenantContext() context: NcContext, @Param('id') id: string) {
    return this.service.deletePermission(context, id);
  }
}
