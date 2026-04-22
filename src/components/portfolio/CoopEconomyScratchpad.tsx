import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { z } from "zod";

const allocationSchema = z.object({
	players: z.coerce.number().min(1).max(8),
	incomePerPlayer: z.coerce.number().min(0),
});

type AllocationRow = { label: string; amount: number };

const columnHelper = createColumnHelper<AllocationRow>();

export default function CoopEconomyScratchpad() {
	const presetsQuery = useQuery({
		queryKey: ["tool-presets", "coop-econ"],
		queryFn: async () => {
			await new Promise((r) => setTimeout(r, 350));
			return [
				{ id: "standard", label: "Standard co-op", bonus: 1 },
				{ id: "hard", label: "Hard mode", bonus: 0.85 },
				{ id: "arcade", label: "Arcade rush", bonus: 1.2 },
			] as const;
		},
	});

	const form = useForm({
		defaultValues: {
			players: 3,
			incomePerPlayer: 750,
		},
		validators: {
			onBlur: allocationSchema,
		},
		onSubmit: async () => undefined,
	});

	const tableData = useMemo(() => {
		const players = form.state.values.players;
		const income = form.state.values.incomePerPlayer;
		const pool = players * income;
		return [
			{ label: "Shared pool", amount: pool },
			{
				label: "Per player (even split)",
				amount: players ? pool / players : 0,
			},
			{
				label: "Reserve (20%)",
				amount: pool * 0.2,
			},
		] satisfies AllocationRow[];
	}, [form.state.values.incomePerPlayer, form.state.values.players]);

	const table = useReactTable({
		data: tableData,
		columns: [
			columnHelper.accessor("label", {
				header: "Line item",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("amount", {
				header: "Minerals (mock)",
				cell: (info) => Math.round(info.getValue()).toLocaleString(),
			}),
		],
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
			<p className="mb-3 text-xs text-[var(--sea-ink-soft)]">
				TanStack Form drives inputs, TanStack Table renders derived rows, and
				TanStack Query loads mock presets you can wire to a real API later.
			</p>
			<div className="grid gap-6 lg:grid-cols-2">
				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<form.Field name="players">
						{(field) => (
							<label className="block text-sm font-semibold text-[var(--sea-ink)]">
								Players
								<input
									type="number"
									min={1}
									max={8}
									className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)]"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										const v = e.target.valueAsNumber;
										field.handleChange(
											Number.isFinite(v) ? v : field.state.value,
										);
									}}
								/>
								{field.state.meta.errors.map((err) => (
									<span
										key={String(err)}
										className="mt-1 block text-xs text-red-600"
									>
										{typeof err === "string" ? err : err?.message}
									</span>
								))}
							</label>
						)}
					</form.Field>
					<form.Field name="incomePerPlayer">
						{(field) => (
							<label className="block text-sm font-semibold text-[var(--sea-ink)]">
								Income / player
								<input
									type="number"
									min={0}
									className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-[var(--sea-ink)]"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => {
										const v = e.target.valueAsNumber;
										field.handleChange(
											Number.isFinite(v) ? v : field.state.value,
										);
									}}
								/>
							</label>
						)}
					</form.Field>
					<button
						type="submit"
						className="rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.16)] px-5 py-2 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.26)]"
					>
						Recalculate table
					</button>
				</form>

				<div>
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
						TanStack Query presets
					</p>
					{presetsQuery.isLoading ? (
						<p className="text-sm text-[var(--sea-ink-soft)]">
							Loading presets…
						</p>
					) : (
						<ul className="mb-4 space-y-2 text-sm text-[var(--sea-ink)]">
							{presetsQuery.data?.map((row) => (
								<li
									key={row.id}
									className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2"
								>
									<span className="font-semibold">{row.label}</span>{" "}
									<span className="text-[var(--sea-ink-soft)]">
										×{row.bonus} income modifier (demo)
									</span>
								</li>
							))}
						</ul>
					)}

					<div className="overflow-x-auto rounded-xl border border-[var(--line)]">
						<table className="w-full border-collapse text-sm">
							<thead className="bg-[var(--sand)] text-left text-xs uppercase tracking-wide text-[var(--sea-ink-soft)]">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th key={header.id} className="px-3 py-2 font-semibold">
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="border-t border-[var(--line)] bg-[var(--surface-strong)]"
									>
										{row.getVisibleCells().map((cell) => (
											<td
												key={cell.id}
												className="px-3 py-2 text-[var(--sea-ink)]"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
