import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$storeId')({
  component: StoreLayout,
})

function StoreLayout() {
  const { storeId } = Route.useParams()

  return (
    <div>
      <Outlet />
    </div>
  )
}