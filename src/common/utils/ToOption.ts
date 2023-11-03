import { replaceEllipsisAfterWords } from '@/common/component/util/ReplaceEllipsis';

export function toOption(item: any, valueKey?: string, labelKey?: string, ellipsis?: boolean) {
	if (valueKey && labelKey) {
		item = { value: item[valueKey], label: ellipsis ? replaceEllipsisAfterWords(item[labelKey], 25) : item[labelKey] };
	} else {
		item = { value: item, label: ellipsis ? replaceEllipsisAfterWords(item, 25) : item };

	}
	return item;
};