import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const formatDate = (value) => {
  if (!value) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const compareText = (first = '', second = '') =>
  first.localeCompare(second, 'en-IN', { sensitivity: 'base' })

function App() {
  const [enrollments, setEnrollments] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const fetchEnrollments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enrollments`)
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load enrollments.')
      }

      setEnrollments(Array.isArray(result.enrollments) ? result.enrollments : [])
      setStatus('success')
    } catch (fetchError) {
      setStatus('error')
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load enrollments.')
    }
  }, [])

  useEffect(() => {
    const loadTimer = window.setTimeout(fetchEnrollments, 0)
    return () => window.clearTimeout(loadTimer)
  }, [fetchEnrollments])

  const handleRefresh = () => {
    setStatus('loading')
    setError('')
    fetchEnrollments()
  }

  const latestEnrollment = useMemo(() => {
    if (!enrollments.length) {
      return 'No submissions yet'
    }

    return formatDate(enrollments[0].createdAt)
  }, [enrollments])

  const gotraSortedEnrollments = useMemo(() => {
    return [...enrollments].sort((first, second) => {
      const firstGotra = first.gotra?.trim() || ''
      const secondGotra = second.gotra?.trim() || ''

      if (!firstGotra && secondGotra) {
        return 1
      }

      if (firstGotra && !secondGotra) {
        return -1
      }

      const gotraOrder = compareText(firstGotra, secondGotra)

      if (gotraOrder !== 0) {
        return gotraOrder
      }

      return compareText(first.name, second.name)
    })
  }, [enrollments])

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span>Jaat Samelan Admin</span>
          <h1>Enrollment Details</h1>
          <p>Submitted visitor registrations from the website popup.</p>
        </div>
        <button type="button" onClick={handleRefresh} disabled={status === 'loading'}>
          {status === 'loading' ? 'Refreshing...' : 'Refresh'}
        </button>
      </section>

      <section className="admin-stats" aria-label="Enrollment overview">
        <div>
          <span>Total Enrollments</span>
          <strong>{enrollments.length}</strong>
        </div>
        <div>
          <span>Latest Submission</span>
          <strong>{latestEnrollment}</strong>
        </div>
      </section>

      {status === 'error' && <p className="admin-alert">{error}</p>}

      <section className="admin-table-section">
        <div className="admin-table-heading">
          <h2>People Enrolled</h2>
          <p>{status === 'loading' ? 'Loading records...' : `${enrollments.length} record${enrollments.length === 1 ? '' : 's'}`}</p>
        </div>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gotra</th>
                <th>Religion</th>
                <th>Profession</th>
                <th>Phone No.</th>
                <th>Address</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {gotraSortedEnrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td>{enrollment.name}</td>
                  <td>{enrollment.gotra || 'Not provided'}</td>
                  <td>{enrollment.religion || 'Not provided'}</td>
                  <td>{enrollment.profession}</td>
                  <td>
                    <a href={`tel:${enrollment.phoneNo}`}>{enrollment.phoneNo}</a>
                  </td>
                  <td>{enrollment.address}</td>
                  <td>{formatDate(enrollment.createdAt)}</td>
                </tr>
              ))}

              {status === 'success' && enrollments.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">No enrollments have been submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
