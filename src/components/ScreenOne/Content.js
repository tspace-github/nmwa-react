import React from 'react'

const Content = ({data, background}) => {
  return (
    <div>
    {data.map(item => (
        <div className="" key={item.id}>
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  )
}

export default Content
