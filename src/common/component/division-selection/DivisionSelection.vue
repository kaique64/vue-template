<template>
  <q-card flat class="q-custom-rounded-border" v-if="divisionOptions">
    <div class="row justify-start">
      <div class="col-12">
        <q-select
            v-model="selectedLabel"
            :options="divisionOptions"
            dense
            outlined
            options-dense
            label="Select a GB"
            class="q-custom-rounded-border"
        >
          <template #no-option>
            <q-item>
              <q-item-section style="border-radius: 10px" class="text-grey">No Results</q-item-section>
            </q-item>
          </template>
          <template v-slot:prepend>
            <q-icon name="place"/>
          </template>
          <template v-slot:selected>
            <q-chip
                v-if="selectedLabel"
                dense
                square
                color="white"
                text-color="black"
                class="no-margin no-padding font-bold-bosch font-14"
                :label="selectedLabel"
            />
            <q-badge v-else>*none*</q-badge>
          </template>
        </q-select>
      </div>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {DivisionStore} from '@/modules/division/store/DivisionStore';
import {UserOptionViewStore} from '@/modules/user-option-view/store/UserOptionViewStore';
import {uid} from 'quasar';
import {ProjectStore} from '@/modules/project/store/ProjectStore';
import {ProjectsToBeValidateService} from '@/modules/home/service/ProjectsToBeValidateService';
import {ProjectCloseToRolloutService} from '@/modules/home/service/ProjectCloseToRolloutService';
import {SummaryService} from '@/modules/home/service/SummaryService';
import {SimilarProjectService} from '@/modules/home/service/SimilarProjectService';
import {UserOptionViewEnum} from '@/modules/user-option-view/enum/UserOptionViewEnum';
import {RolesStore} from '@/modules/roles/store/RolesStore';

interface IProps {
  origin: UserOptionViewEnum;
}

const props = defineProps<IProps>();
const origin = computed(() => props.origin);
const projectStore = ProjectStore();
const divisionStore = DivisionStore();
const userOptionViewStore = UserOptionViewStore();
const selectedValue = ref(userOptionViewStore.userOptionViewData.divisionId);
const divisionOptions = computed(() => divisionStore.divisionOptions);
const projectsToBeValidateService = ProjectsToBeValidateService();
const projectCloseToRolloutService = ProjectCloseToRolloutService();
const summaryService = SummaryService();
const rolesStore = RolesStore();
const similarProjectService = SimilarProjectService();
const getSelectedOption = () => divisionOptions.value.find(option => Number(option.value) === selectedValue.value);

const updateStores = async (dto) => {
  rolesStore.selectedRole = selectedValue.value;
  await userOptionViewStore.changeDivision(dto);
  selectedValue.value = Number(dto.divisionId);
  rolesStore.url = `RoleCost/GetAllByDivision?gbId=${userOptionViewStore.userOptionViewData.divisionId}`;
  rolesStore.renderKey = uid();
};

const selectedLabel = computed({
  get: () => {
    const selectedOption = getSelectedOption();
    return selectedOption ? selectedOption.label : '';
  },
  set: async (newValue) => {
    const selectedOption = getSelectedOption();
    if (selectedOption) {
      const dto = {
        divisionId: Number(newValue.value),
        origin: origin.value.key
      };

      if (Number(newValue.value) !== selectedValue.value) {
        if (origin.value.key === UserOptionViewEnum.ROLE_COST_PREMISES.key) {
          await updateStores(dto);
        } else if (origin.value.key === UserOptionViewEnum.LANDING_PAGE.key) {
          await updateStores(dto);
          await projectsToBeValidateService.fetchProjectsToBeValidated();
          await projectCloseToRolloutService.fetchProjectsCloseToRollout();
          await summaryService.fetchSummary();
          await similarProjectService.fetchSimilarProjects();
          projectStore.renderKey = uid();
        }
      }
    }
  }
});

onMounted(async () => {
  if (userOptionViewStore.userOptionViewData) {
    await userOptionViewStore.getAll(origin.value.key);
    divisionStore.getDivisions();
    selectedValue.value = userOptionViewStore.userOptionViewData.divisionId;
    if (origin.value.key === UserOptionViewEnum.ROLE_COST_PREMISES.key) {
      rolesStore.selectedRole = selectedValue.value;
      rolesStore.url = `RoleCost/GetAllByDivision?gbId=${userOptionViewStore.userOptionViewData.divisionId}`;
      rolesStore.renderKey = uid();
    } else if (origin.value.key === UserOptionViewEnum.LANDING_PAGE.key) {
      await projectsToBeValidateService.fetchProjectsToBeValidated();
      await projectCloseToRolloutService.fetchProjectsCloseToRollout();
      await summaryService.fetchSummary();
      await summaryService.fetchResourcePeak();
      await similarProjectService.fetchSimilarProjects();
      projectStore.renderKey = uid();
    }
  }
});
</script>