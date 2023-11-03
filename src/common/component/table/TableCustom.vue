<template>
  <q-table
    :key="renderKey"
    ref="tableRef"
    v-model:pagination="pagination"
    v-model:selected="selectionModel"
    row-key="id"
    :title="titleProps?.table"
    :columns="columns"
    :rows="rows"
    title-class="text-black text"
    table-header-style="font-bold"
    :bordered="bordered"
    :flat="flat"
    color="btn-primary"
    :class="virtualScroll && 'virtscroll-table'"
    :filter="filter"
    no-data-label="No data found"
    no-results-label="No data found"
    :loading="loadingTable"
    :rows-per-page-options="[5, 10, 20, 50]"
    :selection="selectionType"
    :selected-rows-label="getSelectedString"
    :wrap-cells="true"
    @request="onRequest"
  >
    <template #body-selection="scope">
      <q-checkbox v-model="scope.selected" />
    </template>
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <!-- Header table -->
    <template v-if="header" #top-left>
      <q-input v-model="filter" borderless dense debounce="300" placeholder="Search">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-if="header" #top-right>
      <Button
        v-if="add"
        button-id="id-add-button"
        button-icon="mdi-plus-box-multiple-outline"
        flat
        button-label="Add"
        button-class="btn-secondary q-ml-md font-bold-bosch"
        @click="handleAdd"
      >
        <q-tooltip>{{ addTooltip }}</q-tooltip>
      </Button>
    </template>
    <template #body-cell-actions="props">
      <q-td v-if="actions" key="actions" :props="props">
        <Button
          flat
          button-id="btn-confirm-company-update"
          button-size="md"
          style="width: 36px; height: 10px"
          button-class="btn-secondary q-mr-md"
          button-icon="mdi-pencil-outline"
          @click="(e) => handleEdit(props.row)"
        >
          <q-tooltip>Edit row</q-tooltip>
        </Button>
        <Button
          flat
          button-id="btn-confirm-company-delete"
          button-size="md"
          style="width: 36px; height: 10px"
          class="btn-secondary"
          button-icon="mdi-delete-outline"
          @click="(e) => handleDelete(props.row)"
        >
          <q-tooltip>Delete row</q-tooltip>
        </Button>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="dialogAdd" persistent>
    <DialogTemplate
      :title="titleProps?.add"
      :width="width"
      :height="height"
      :close-btn="true">
      <template #content>
        <div v-if="modalModel === 'CompanyModalForm'">
          <CompanyModalForm />
        </div>
        <div v-else>
          <Forms
            :field-values="rowsAdd"
            btn-primary-label-value="Add"
            btn-secondary-label-value="Cancel"
            :loading="loading?.add"
            @submit-action="$emit('add', () => (dialogAdd = false), storeProps)"
          >
            <template #content>
              <div class="col-12 text-right">
                <Button
                  flat
                  type="submit"
                  button-id="btn-confirm-company-update"
                  button-size="md"
                  button-class="btn-primary q-mr-md"
                  button-label="Add"
                  :button-loading="loading?.add"
                />
                <Button
                  v-if="!loading?.add"
                  v-close-popup
                  flat
                  button-id="btn-cancel-company-delete"
                  button-size="md"
                  button-class="btn-secondary"
                  button-label="Cancel"
                />
              </div>
            </template>
          </Forms>
          <!-- Button Forms -->
        </div>
      </template>
    </DialogTemplate>
  </q-dialog>

  <q-dialog v-model="dialogEdit" persistent>
    <DialogTemplate :title="titleProps?.edit" width="25vw" height="85vh" :close-btn="true">
      <template #content>
        <Forms
          :field-values="rowsEdit"
          btn-primary-label-value="Update"
          btn-secondary-label-value="Cancel"
          :loading="loading?.edit"
          @submit-action="$emit('edit', () => (dialogEdit = false), storeProps)"
        >
          <template #content>
            <div class="col-12 text-right">
              <Button
                flat
                type="submit"
                button-id="btn-confirm-company-update"
                button-size="md"
                button-class="btn-primary q-mr-md"
                button-label="Update"
                :button-loading="loading?.edit"
              />
              <Button
                v-if="!loading?.edit"
                v-close-popup
                flat
                button-id="btn-cancel-company-delete"
                button-size="md"
                button-class="btn-secondary"
                button-label="Cancel"
              />
            </div>
          </template>
        </Forms>
      </template>
    </DialogTemplate>
  </q-dialog>

  <q-dialog v-model="dialogDelete" persistent>
    <DialogTemplate :title="titleProps?.delete" width="40vw" height="40vh" :close-btn="true">
      <template #content>
        <div class="row q-pa-md justify-end">
          <div class="col-12">
            <div class="row q-pa-sm text-bosch">
              <div class="font-bold-bosch font-16">{{ deleteTitle }}</div>
            </div>
            <div class="row q-pa-sm text-bosch">{{ deleteDescription }}</div>
          </div>
          <div class="col-12 q-pa-sm text-right">
            <Button
              flat
              button-id="btn-confirm-company-update"
              button-size="md"
              button-class="btn-primary q-mr-md"
              button-label="Delete"
              :button-loading="loading?.delete"
              @click="$emit('delete', () => (dialogDelete = false), storeProps)"
            />
            <Button
              v-if="!loading?.delete"
              v-close-popup
              flat
              button-id="btn-cancel-company-delete"
              button-size="md"
              button-class="btn-secondary"
              button-label="Cancel"
            />
          </div>
        </div>
      </template>
    </DialogTemplate>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, Ref, ref, watch } from 'vue';
import Button from '@/common/component/button/Button.vue';
import DialogTemplate from '@/common/component/dialog/DialogTemplate.vue';
import Forms from '@/common/component/forms/Forms.vue';
import { RestService } from '@/common/service/integration/RestService';
import { uid } from 'quasar';
import CompanyModalForm from '@/modules/companies/component/CompanyModalForm.vue';
import { capitalizeText } from '../util/CapitalizeText';

type TitleProps = { table?: string; add: string; edit: string; delete: string };
type TModalModel = 'CompanyModalForm';

interface Props {
  rows: any[];
  columns: any[];
  titleProps?: TitleProps;
  deleteTitle?: string;
  deleteDescription?: string;
  add?: boolean;
  addTooltip?: string;
  storeProps?: Object;
  formModel?: any;
  loading?: { add?: boolean; edit?: boolean; delete?: boolean };
  customFilter?: any;
  rowsInCapitalizeFormat ?: boolean;
  entitySource?: string;
  filterableColumns?: string[];
  modalModel?: TModalModel;
  header?: boolean;
  selectionType?: 'multiple' | 'single';
  selectionModel?: any;
  actions: boolean;
  bordered?: boolean;
  virtualScroll?: boolean;
  flat?: boolean;
}

const props = defineProps<Props>();
const filter = ref(props.customFilter ?? '');
const entitySource = ref(props.entitySource);
const rows = ref(props.rows);
const columns = ref(props.columns);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const titleProps = ref(props.titleProps);
const actions = ref(props.actions);
const addTooltip = ref(props.addTooltip);
const storeProps = ref(props.storeProps);
const dialogAdd = ref(false);
const rowsEdit = ref(props.formModel);
const rowsAdd = ref(props.formModel);
const loadingTable = ref(false);
const totalCount = ref(0);
const tableRef = ref();
const renderKey = ref(uid());
const modalModel = ref(props.modalModel);
const selectionType = ref(props.selectionType);
const selectionModel = ref(props.selectionModel);
const dataPaginated: any = ref([]);
const dataFiltered = ref([]);
const virtualScroll = ref(props.virtualScroll);
const bordered = ref(props.bordered);
const flat = ref(props.flat);
const rowsInCapitalizeFormat = ref(props.rowsInCapitalizeFormat);

interface Pagination {
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
  descending: boolean;
  sortBy: any;
}

const pagination: Ref<Pagination> = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
  descending: false,
  sortBy: null
});

const width = modalModel.value === 'CompanyModalForm' ? '85vw' : '25vw';
const height = modalModel.value === 'CompanyModalForm' ? '90vh' : '65vh';

defineEmits(['add', 'edit', 'delete', 'cancel', 'request']);

function getSelectedString() {
  localStorage.setItem('selectedCompanies', JSON.stringify(selectionModel.value));
  return selectionModel.value.length === 0 ? '' : `${selectionModel.value.length} record${selectionModel.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`;
}

function formatDataToCapitalizeText(dataToFormat: any) {
  dataToFormat = dataToFormat.map((data: any) => {
    const formattedData: any  = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        formattedData[key] = capitalizeText(data[key]);
      } else {
        formattedData[key] = data[key];
      }
    }
    return formattedData;
  })  
  return dataToFormat;
}

function paginate(array: any, page_size: number, page_number: number) {
  const startIndex = (page_number - 1) * page_size;
  const endIndex = startIndex + page_size;
  const arrayToPaginate = array.results ? array.results : array;
  return arrayToPaginate.slice(startIndex, endIndex);
}

async function loadData(startRow: number, count: number) {
  loadingTable.value = true;

  try {
    const verifyPage = filter.value && totalCount.value !== 0 && startRow > 1 ? startRow - 1 : startRow;
    const verifyPageSize = filter.value && totalCount.value !== 0 ? totalCount.value : count;

    let urlParam;
    if (entitySource.value) {
      if (entitySource.value.includes('/')) {
        if (entitySource.value.includes('page')) {
          const pageStartIndex = entitySource.value.indexOf("page=");
          const pageEndIndex = entitySource.value.indexOf("&", pageStartIndex);
          const originalPageParam = entitySource.value.substring(pageStartIndex, pageEndIndex);
          const pageSizeStartIndex = entitySource.value.indexOf("pageSize=");
          const pageSizeEndIndex = entitySource.value.indexOf("&", pageSizeStartIndex);
          const originalPageSizeParam = entitySource.value.substring(pageSizeStartIndex, pageSizeEndIndex);
          entitySource.value = entitySource.value.replace(originalPageParam, `page=${verifyPage}`).replace(originalPageSizeParam, `pageSize=${verifyPageSize}`);
        }
        urlParam = entitySource.value;
      } else {
        urlParam = `/${entitySource.value}?page=${verifyPage}&pageSize=${verifyPageSize}`;
      }
    }

    const response = await new RestService().executeGet({
      url: `${urlParam}`
    });

    const resultData = entitySource.value.includes('/') ? response : response.results;
    // Get data filtered and paginate it
    if (filter.value) {
      const result = resultData.results ? resultData.results : resultData;
      dataFiltered.value = result.filter((row) => {
        for (const column of props.filterableColumns ?? []) {
          row[column] = column === 'expert' ? row['roleCost']['name'] : row[column];
          row[column] = column === 'resourceProvider' ? row['roleCost'][column]['name'] : row[column];
          if (
            row[column] &&
            row[column].toString().toLowerCase().includes(filter.value.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      dataPaginated.value = paginate(dataFiltered.value, count, startRow);
    } else {
      if (entitySource.value.includes('/')) {
        if (entitySource.value.includes('page')) {
          dataPaginated.value = resultData.results.slice();
        } else {
          dataPaginated.value = paginate(resultData, count, startRow);
        }
      } else {
        dataPaginated.value = resultData.slice();
      }
    }
    pagination.value.rowsNumber = totalCount.value = entitySource.value.includes('/') ? ( entitySource.value.includes('?page') ? response.rowCount : response.length) : response.rowCount;

    
    if (rowsInCapitalizeFormat.value) {
      dataPaginated.value = formatDataToCapitalizeText(dataPaginated.value);  
    }

    rows.value = dataPaginated.value;
  } finally {
    loadingTable.value = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  const fetchCount = rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
  await loadData(page, fetchCount);
  if (filter.value) {
    pagination.value.page = page;
    pagination.value.rowsNumber = dataFiltered.value.length;
  }

  setTimeout(() => {
    rows.value.splice(0, rows.value.length, ...rows.value);
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  });
}

const handleEdit = async (props: any) => {
  for (const key in rowsEdit.value) {
    if (key === 'companytShirtSize') {
      rowsEdit.value[key].value = {};
      rowsEdit.value[key].value.value = props.companyTShirtSize.id;
      rowsEdit.value[key].value.label = props.companyTShirtSize.name;
    } else if (key === 'tShirtSizeHorinzontalLayerId'  && props.companytShirtSizeHorinzontalLayer !== null) {
      rowsEdit.value[key].value = {};
      rowsEdit.value[key].value.value = props.companytShirtSizeHorinzontalLayer.id;
      rowsEdit.value[key].value.label = props.companytShirtSizeHorinzontalLayer.name;
    } else if (key === 'resourceProvider') {
      rowsEdit.value[key].value = {};
      rowsEdit.value[key].value.value = props.resourceProvider.id;
      rowsEdit.value[key].value.label = props.resourceProvider.name;
    } else if (key === 'expert') {
      rowsEdit.value[key].value = {};
      rowsEdit.value[key].value.value = props.roleCost.id;
      rowsEdit.value[key].value.label = props.roleCost.name;
    } else {
      rowsEdit.value[key].value = props[key];
    }
  }
  storeProps.value = props;
  dialogEdit.value = true;
  renderKey.value = uid();
  tableRef.value.requestServerInteraction();
};

const handleDelete = async (props: any) => {
  storeProps.value = props;
  dialogDelete.value = true;
  tableRef.value.requestServerInteraction();
};

const handleAdd = async () => {
  storeProps.value = {};
  dialogAdd.value = true;
  rowsAdd.value = props.formModel ? props.formModel : null;

  // Limpar os valores dos inputs no modal de edição
  for (const key in rowsEdit.value) {
    if (rowsEdit.value.hasOwnProperty(key)) {
      const value = rowsEdit.value[key].fieldType;
      let result;

      switch (value) {
        case 'select':
        case 'select:multiple':
          result = null;
          break;
        case 'input':
          result = '';
          break;
        case 'input:number':
        case 'input:currency':
          result = 0;
          break;
        case 'dropdown':
          result = null;
          break;
        default:
          console.error('Tipo inválido encontrado:', value);
          break;
      }
      rowsEdit.value[key].value = result;
    }
  }


  tableRef.value.requestServerInteraction();
};


onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction();
});
</script>

<style lang="scss">
.q-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  outline: 0;
  border: 0;
  vertical-align: middle;
  font-size: 14px;
  line-height: 1.715em;
  text-decoration: none;
  background: transparent;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  width: auto;
  height: auto;
  color: black;
  cursor: default;
  padding: 4px 16px;
  min-height: 2.572em;
}
.virtscroll-table {
  /* height or max-height is important */
  max-height: 930px;

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  /* this will be the loading indicator */
  thead tr:last-child th {
    top: 48px
  }

  /* height of all previous header rows */
  thead tr:first-child th {
    top: 0;
  }
}
</style>
