<script lang="ts">
	import { slide, blur } from 'svelte/transition';
	import { notifications } from 'shared/stores/default.store';
	import Icons from 'components/icons';

	const remove = (id: string) => () => {
		notifications.update(_notifications =>
			_notifications.filter(notification => notification.id !== id)
		);
	};

	const timersId = [];

	notifications.subscribe(_notifications => {
		const newNotification = _notifications?.find(
			notification => !timersId.includes(notification.id)
		);

		if (newNotification) {
			setTimeout(remove(newNotification.id), 5000);
			timersId.push(newNotification.id);
		}
	});
</script>

{#if $notifications.length}
	<ul>
		{#each $notifications as notification (notification.id)}
			<li in:slide out:blur>
				<div>
					<p>{notification.text}</p>
					<button on:click={remove(notification.id)}><Icons.Delete /></button>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		position: fixed;
		right: 0.5rem;
		bottom: 0.5rem;
		z-index: 2;
		list-style: none;
		width: 20rem;
	}

	li:not(:last-child) {
		margin-bottom: 0.5rem;
	}

	div {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		width: 100%;
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--color);
		animation: slideIn 0.3s;
	}

	div:before,
	div:after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 4px;
		border-radius: 4px;
	}

	div:before {
		background-color: rgba(255, 255, 255, 0.5);
	}

	div:after {
		background-color: rgba(255, 255, 255, 0.8);
		animation: fill 5s;
		transform-origin: 0 center;
	}

	p {
		flex: 1 1 auto;
		font-size: 0.8rem;
	}

	button {
		margin-left: 1rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.5;
	}

	@keyframes slideIn {
		0% {
			transform: translateX(150%);
		}
		100% {
			transform: translateX(0);
		}
	}

	@keyframes fill {
		0% {
			transform: scaleX(0);
		}
		100% {
			transform: scaleX(1);
		}
	}
</style>
