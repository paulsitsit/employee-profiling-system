const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const loader = (
    <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin`}></div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
        {loader}
      </div>
    )
  }

  return loader
}

export default Loader