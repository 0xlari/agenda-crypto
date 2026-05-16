import { getAdminDashboardData } from "@/lib/supabase/admin-queries";

function MetricCard({
  title,
  value,
  description,
  highlight,
}: {
  title: string;
  value: string | number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-blue-400/30 bg-blue-500/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className="text-sm text-zinc-400">{title}</p>

      <strong className="mt-3 block text-3xl font-semibold text-white">
        {value}
      </strong>

      <p className="mt-2 text-xs leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function FunnelRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 8 : 0) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-400"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function SignalCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>

        <strong className="text-lg text-blue-300">{value}</strong>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const { overview, hotEvents, topCities, topCategories } =
  await getAdminDashboardData();

  const funnelMax = Math.max(
    overview.totalViews,
    overview.totalSaves,
    overview.totalGoing,
    overview.totalCheckins,
    overview.totalPasses
  );

  return (
    <main className="min-h-screen bg-[#08080C] px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
              Agenda Intelligence
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Dashboard administrativo
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Visão estratégica sobre eventos, intenção, presença, passes e
              sinais comerciais do ecossistema crypto LATAM.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
            Produto em inteligência beta
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <MetricCard
            title="Eventos ativos"
            value={overview.activeEvents}
            description="Eventos publicados que ainda vão acontecer."
          />

          <MetricCard
            title="Usuários cadastrados"
            value={overview.totalUsers}
            description="Base identificada da Agenda Crypto."
          />

          <MetricCard
            title="Usuários ativos"
            value={overview.totalActiveUsers}
            description="Usuários únicos logados que fizeram alguma interação na Agenda."
          />

          <MetricCard
            title="Interações logadas"
            value={overview.totalLoggedInteractions}
            description="Total de ações realizadas por usuários autenticados."
          />

          <MetricCard
            title="Logados com view"
            value={overview.totalUniqueLoggedViews}
            description="Usuários logados únicos que visualizaram páginas de eventos."
          />

          <MetricCard
            title="Views totais"
            value={overview.totalViews}
            description="Total de visualizações registradas nas páginas de eventos."
            />

          <MetricCard
            title="Intenções"
            value={overview.totalIntentions}
            description="Soma de saves e marcações de presença."
            highlight
          />

          <MetricCard
            title="Check-ins validados"
            value={overview.totalCheckins}
            description="Presenças confirmadas em eventos."
          />

          <MetricCard
            title="Agenda Pass"
            value={overview.totalPasses}
            description="Passes emitidos para usuários."
          />

          <MetricCard
            title="Taxa de intenção"
            value={`${overview.intentRate}%`}
            description="Saves + Vou em relação às views totais."
            highlight
            />

            <MetricCard
              title="Engajamento por usuário"
              value={overview.actionsPerLoggedUser}
              description="Média de ações de intenção por usuário logado: saves + vou."
              highlight
            />

          <MetricCard
            title="Taxa de presença"
            value={`${overview.showUpRate}%`}
            description="Check-ins validados em relação ao Vou."
            highlight
          />

          <MetricCard
            title="Usuários com Pass"
            value={overview.totalUsersWithPass}
            description="Usuários únicos que já receberam pelo menos um Agenda Pass."
          />

          <MetricCard
            title="CTR de inscrição"
            value={`${overview.registrationCtr}%`}
            description="Cliques em inscrição em relação às views totais."
            highlight
          />

          <MetricCard
            title="Conversão para presença"
            value={`${overview.showUpRate}%`}
            description="Check-ins validados em relação às marcações de Vou."
            highlight
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Funil da Agenda</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Da descoberta até a jornada colecionável.
            </p>

            <div className="mt-6 space-y-4">
              <FunnelRow
                label="Views totais"
                value={overview.totalViews}
                max={funnelMax}
                />

                <FunnelRow
                label="Usuários únicos logados"
                value={overview.totalUniqueLoggedViews}
                max={funnelMax}
                />

              <FunnelRow
                label="Saves"
                value={overview.totalSaves}
                max={funnelMax}
              />

              <FunnelRow
                label="Vou"
                value={overview.totalGoing}
                max={funnelMax}
              />

              <FunnelRow
                label="Check-ins"
                value={overview.totalCheckins}
                max={funnelMax}
              />

              <FunnelRow
                label="Agenda Pass"
                value={overview.totalPasses}
                max={funnelMax}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Sinais comerciais</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Indicadores iniciais para mídia, parcerias e relatórios.
            </p>

            <div className="mt-6 space-y-4">
              <SignalCard
                title="Interesse captado"
                value={overview.totalIntentions}
                description="Usuários salvaram ou marcaram presença em eventos."
              />

              <SignalCard
                title="Presença comprovada"
                value={overview.totalCheckins}
                description="Base para mostrar impacto real para organizadores."
              />

              <SignalCard
                title="Jornada colecionável"
                value={overview.totalPasses}
                description="Passes emitidos como registro de participação."
              />

              <SignalCard
                title="Submissões pendentes"
                value={overview.pendingSubmissions}
                description="Eventos enviados aguardando avaliação."
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Cidades mais fortes</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Cidades com mais eventos publicados na Agenda.
            </p>

            <div className="mt-6 space-y-3">
              {topCities.map((item) => (
                <div
                  key={item.city}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-sm text-zinc-300">{item.city}</span>
                  <strong className="text-blue-300">{item.total}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Categorias mais fortes</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Narrativas com mais eventos publicados.
            </p>

            <div className="mt-6 space-y-3">
              {topCategories.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-sm text-zinc-300">{item.category}</span>
                  <strong className="text-blue-300">{item.total}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Eventos mais quentes</h2>

              <p className="mt-2 text-sm text-zinc-400">
                Ranking por score de inteligência: views totais, usuários únicos logados,
                saves, vou, check-ins, passes e cliques.
              </p>
            </div>

            <p className="text-xs text-zinc-500">
              Top 10 eventos por tração dentro da Agenda
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="py-3 pr-4">Evento</th>
                  <th className="py-3 pr-4">Cidade</th>
                  <th className="py-3 pr-4">Views totais</th>
                  <th className="py-3 pr-4">Únicos logados</th>
                  <th className="py-3 pr-4">Saves</th>
                  <th className="py-3 pr-4">Vou</th>
                  <th className="py-3 pr-4">Check-ins</th>
                  <th className="py-3 pr-4">Passes</th>
                  <th className="py-3 pr-4">Intenção</th>
                  <th className="py-3 pr-4">Presença</th>
                  <th className="py-3 pr-4">Score</th>
                </tr>
              </thead>

              <tbody>
                {hotEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-white/5 text-zinc-300"
                  >
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium text-white">{event.title}</p>

                        <p className="text-xs text-zinc-500">
                          {event.category || "Sem categoria"}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 pr-4">{event.city || "-"}</td>
                    <td className="py-4 pr-4">{event.views}</td>
                    <td className="py-4 pr-4">{event.unique_logged_views}</td>
                    <td className="py-4 pr-4">{event.saves}</td>
                    <td className="py-4 pr-4">{event.going}</td>
                    <td className="py-4 pr-4">{event.checkins}</td>
                    <td className="py-4 pr-4">{event.passes}</td>
                    <td className="py-4 pr-4">{event.intent_rate}%</td>
                    <td className="py-4 pr-4">{event.show_up_rate}%</td>

                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {event.intelligence_score}
                      </span>
                    </td>
                  </tr>
                ))}

                {hotEvents.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-10 text-center text-sm text-zinc-500"
                    >
                      Ainda não há dados suficientes para montar o ranking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Newsletter</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Base de distribuição para eventos, conteúdos e ativações.
            </p>

            <strong className="mt-6 block text-3xl font-semibold text-white">
              {overview.totalSubscribers}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Eventos publicados</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Total de eventos disponíveis ou já listados na plataforma.
            </p>

            <strong className="mt-6 block text-3xl font-semibold text-white">
              {overview.publishedEvents}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Cliques em inscrição</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Total de Cliques no botão de inscrição.
            </p>

            <strong className="mt-6 block text-3xl font-semibold text-white">
              {overview.totalRegistrationClicks}
            </strong>
          </div>
        </section>
      </div>
    </main>
  );
}