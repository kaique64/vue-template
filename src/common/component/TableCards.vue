<template>
  <q-table
      grid
      :rows="rows"
      :columns="columns"
      row-key="name"
      hide-header
      hide-pagination
      :rows-per-page-options="[8]"
      card-container-class="justify-evenly"
  >
    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center q-gutter-sm text-orange-9 font-14 font-bold-bosch">
        <q-icon size="2em" name="sentiment_dissatisfied"/>
        <span>{{noDataMessage}}</span>
      </div>
    </template>
    <template #item="scope">
      <q-card
          bordered class="q-pa-md q-ma-lg col-12 q-custom-rounded-border font-12 my-box cursor-pointer q-hoverable"
          v-ripple
          :style="`width: ${widthCard}`"
          @click.prevent="handleClick(scope.row.projectId??scope.row.id)"
      >
        <span class="q-focus-helper"></span>
        <div class="row justify-between">

          <div class="col-lg-8 col-xl-8 col-md-12 col-sm-12 col-xs-12 text-left">
            {{ scope.row.projectName ?? scope.row.name }}
          </div>

          <div class="col-lg-2 col-xl-2 col-md-12 col-sm-12 col-xs-12 text-right">
            <q-avatar>
              <q-icon color="blue-10"
                      name="mdi-account"
                      size="xl"
                      style="border-radius: 50px"
                      v-if="!avatar(scope.row.createdBy).value"
              />
              <q-img
                  v-else
                  :src="avatar(scope.row.createdBy).value"
                  rounded
              />
              <q-tooltip v-if="avatar(scope.row.createdBy).value">
                {{ userStore.getUserById(scope.row.createdBy, UserIdTypeEnum.BOSCH_NT).value.displayName }}
              </q-tooltip>
            </q-avatar>
          </div>
        </div>
        <div class="row justify-between q-mt-lg">
          <div class="col-lg-5 col-xl-5 col-md-12 col-sm-12 col-xs-12 text-left">
            <q-chip
                :class="'q-pa-sm no-margin ' + getChipClass(scope.row.validated)"
            >
              {{ getStatusName(scope.row.validated) }}
            </q-chip>
          </div>
          <div class="col-lg-6 col-xl-6 col-md-12 col-sm-12 col-xs-12 text-right">
            <q-chip
                v-if="scope.row.updatedAt"
                class="q-pa-sm lastSeen"
            >
              {{ returnChangedInWithoutTimeFromDate(scope.row.updatedAt) }}
            </q-chip>
            <q-chip
                v-if="scope.row.monthQuantity"
                class="q-pa-sm lastSeen"
            >
              Duration: {{ scope.row.monthQuantity }} {{ hasMonth(scope.row.monthQuantity) }}
            </q-chip>
          </div>
        </div>
      </q-card>
    </template>
  </q-table>
  <q-dialog v-model="showModalProject" persistent>
    <DialogTemplate :title="title" :width="width" :height="height" :close-btn="true">
      <template #content>
        <div class="q-mr-lg q-ml-lg">
          <ShowProject :project-id="projectId"/>
        </div>
      </template>
    </DialogTemplate>
  </q-dialog>
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar';
import {computed, onMounted, ref, watch} from 'vue';
import {IScreenParams} from '@/common/type/IScreenParams';
import {getScreenSize} from '@/common/component/util/ScreenFunctions';
import {UserStore} from '@/modules/user/store/UserStore';
import {useDateFormatterService} from '@/common/service/DateFormatterService';
import {useRouter} from 'vue-router';
import {UserIdTypeEnum} from '@/modules/user/type/UserIdTypeEnum';
import ShowProject from '@/modules/project/component/ShowProject.vue';
import DialogTemplate from '@/common/component/dialog/DialogTemplate.vue';
import {ShowProjectStore} from '@/modules/project/store/ShowProjectStore';

const router = useRouter();
const dateFormat = useDateFormatterService();
const showProjectStore = ShowProjectStore();
const $q = useQuasar();
const screenSize = ref($q.screen.name);
const widthCard = ref();
const userStore = UserStore();
const screenParams: IScreenParams = {
  sm: '50vw',
  xs: '100vw',
  md: '35vw',
  lg: '20vw',
  xl: '20vw'
};

interface Props {
  rows: any[];
  columns: any[];
  openProject: boolean;
  noDataMessage: string;
}

const props = defineProps<Props>();
const openProject = props.openProject;
const noDataMessage = computed(() => props.noDataMessage);
const showModalProject = computed({
  get: () => {
    return showProjectStore.showProject
  },
  set: (newValue) => {
    showProjectStore.showProject = newValue
  }
});
const projectId = ref(0);
const width = '85vw';
const height = '100vh';
const title = 'Show Project Details';

watch(
    () => $q.screen.name,
    (newScreenSize) => {
      screenSize.value = newScreenSize;
      widthCard.value = getScreenSize(newScreenSize, screenParams);
    }
);

onMounted(() => {
  widthCard.value = getScreenSize(screenSize.value, screenParams);
});

const columns = computed(() => props.columns);

const rows = computed(() => props.rows);

const avatar = (createdBy: string) => userStore.getUserPhoto(createdBy);

const getChipClass = (validated: boolean) => validated ? "validatedStatus" : "noValidatedStatus";
const getStatusName = (validated: boolean) => validated ? "Validated" : "Under Validation";

const returnChangedInWithoutTimeFromDate = (dateString: Date) => {
  const date = dateFormat.formatDateForDisplay(dateString);

  return `Changed in ${date}`;
};

const hasMonth = (value: number) => (value > 1) ? " months" : " month";

const handleClick = (id: number) => {
  if (openProject) {
    showProjectStore.showProject = true
    projectId.value = id
  } else {
    router.push({path: `/project/projectId=${id}`});
  }
};

</script>
