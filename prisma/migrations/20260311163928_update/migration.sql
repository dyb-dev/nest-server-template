-- DropIndex
DROP INDEX "sys_dict_item_is_active_idx";

-- DropIndex
DROP INDEX "sys_dict_item_label_idx";

-- CreateIndex
CREATE INDEX "sys_dict_item_type_id_is_active_idx" ON "sys_dict_item"("type_id", "is_active");
