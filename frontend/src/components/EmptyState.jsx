import { Inbox } from 'lucide-react'

const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {action && (
        <div className="flex gap-3">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState