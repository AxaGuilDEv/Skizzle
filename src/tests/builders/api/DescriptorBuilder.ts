import type { AzureDevOpsDescriptorApiType } from 'models/api/AvatarApiType';

class AzureDevOpsDescriptorBuilder {
	private descriptor = {} as AzureDevOpsDescriptorApiType;

	withDescriptor(): AzureDevOpsDescriptorBuilder {
		this.descriptor.value = 'descriptor';

		return this;
	}

	build(): AzureDevOpsDescriptorApiType {
		return this.descriptor;
	}
}

export { AzureDevOpsDescriptorBuilder };
