import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import './SelectInformation.css'

const SelectInformation = props => {
  // grab authentication token to ensure logged in user
  const token = localStorage.getItem('token')
  const [isLoggedIn, setIsLoggedIn] = useState(token && true)
  // placeholder id
  const [userId] = useState(() => '6562c186a4a586c6e19a4eef')
  const [data, setData] = useState(() => [])
  // track which boxes are checked
  const [checked, setChecked] = useState(() => []) // bool array
  const [allChecked, setAllChecked] = useState(() => true) // bool

  const handleSelectAll = () => {
    const checkedCopy = checked
    // if all checked, then uncheck, else check
    setChecked(checkedCopy.map(() => !allChecked))
  }

  const handleCheckBox = e => {
    const checkedCopy = [...checked]
    checkedCopy[e.target.id] = e.target.checked
    setChecked(checkedCopy)
  }

  const handleSubmit = () => {
    console.log('Submitted!')
  }

  // get data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL
        const response = await axios.get(`${apiUrl}/users/${userId}/platforms`,
                          { headers: { Authorization: `JWT ${token}` } })
        setData(response.data)
      } catch (err) {
        // log the user out if token is invalid
        setIsLoggedIn(false)
        console.error(err)
      }
    }
    fetchData()
  }, [userId, token])

  // initialize checked after data is set
  useEffect(() => {
    setChecked(Array.from({ length: data.length }, () => true))
  }, [data])

  // check if all checked after `checked` changes (confusing i know)
  // extra comment
  useEffect(() => {
    if (checked.length) {
      setAllChecked(checked.reduce((acc, head) => acc && head))
    }
  }, [checked])

  return (
    <>
    {isLoggedIn ? (
      <div className="select-information-form">
        <div className="select-information-header">
          <h2>Select Information</h2>
        </div>
        <div className="select-information-body">
          <div className="select-information-all-item">
            <div className="select-information-all-label">
              <label className="select-information-all-label-text">Select All</label>
            </div>
            <div className="select-information-all-checkbox">
              <label className="select-information-all-slider-label">
                <input className="select-information-all-input"
                       type="checkbox"
                       checked={allChecked}
                       onChange={handleSelectAll}/>
                <span className="select-information-all-slider"></span>
              </label>
            </div>
          </div>
          {data.map((platform,index) =>
          <div className="select-information-item" key={`item_${index}`}>
            <div className="select-information-label">
              <label className="select-information-label-text">
                  {platform.name}: {platform.value}
              </label>
            </div>
            <div className="select-information-checkbox">
              <label className="select-information-slider-label">
                <input className="select-information-input"
                       id={index /* passed to update state */}
                       type="checkbox"
                       checked={checked[index] || false /* was triggering an
                       uncontrolled component warning without second part */}
                       onChange={e => handleCheckBox(e)} />
                <span className="select-information-slider"></span>
              </label>
            </div>
          </div>
          )}
          {data.length === 0 ? 
              <p className="select-information-no-info-message">
                Sorry, you don&apos;t have any information yet!
              </p> 
              : <></>}
        </div>
        <div className="select-information-submit-item">
          <button className="select-information-submit-button" 
                  type="button" 
                  onClick={handleSubmit}>
            Generate My QR Code
         </button>
        </div>
      </div>
    ) : (
      <Navigate to='/' />
    )}
    </>
  )
}

export default SelectInformation
