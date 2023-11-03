import { ProjectPhaseDTO } from '@/modules/project/dto/ProjectPhaseDTO';

export function selectedTab(projectPhase: ProjectPhaseDTO[]) {
	projectPhase.sort((a, b) => {
		const startDateA = new Date(a.startDate);
		const startDateB = new Date(b.startDate);
		return startDateA.getTime() - startDateB.getTime();
	});

	return projectPhase[0]?.phaseName || '';
}