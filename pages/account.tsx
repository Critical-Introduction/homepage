
import { useEffect, useState, Fragment, useRef } from 'react'
import { Dialog, Switch, Transition } from '@headlessui/react'
import { db } from '../config/supabaseClient'
import { CheckIcon } from '@heroicons/react/outline'

const test = null
interface IProfile {
    username: string,
    firstName: string,
    lastName: string,
    about:string,
    isCustomer: boolean,
}

const user = {
  name: 'Debbie Lewis',
  handle: 'default',
  email: 'debbielewis@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
}


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function account() {

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('unknown')
    const [lastName, setLastName] = useState('unknown')
    const [about, setAbout] = useState('tell us about you')
    const [website, setWebsite] = useState('')
    const [avatar_url, setAvatarUrl] = useState('')
    const [isCustomer, setIsCustomer] = useState(false)

  const [availableToHire, setAvailableToHire] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)
  const [allowCommenting, setAllowCommenting] = useState(true)
  const [allowMentions, setAllowMentions] = useState(true)

  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    setSession(db.auth.session())

    db.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    getProfile()
    
  }, [])

//   useEffect(() => {
//     getProfile()
//   }, [session])



  const getProfile = async() => {
    try{
        setLoading(true)
        const user = db.auth.user()

        let { data, error, status } = await db
        .from('profiles').select(`username, website, avatar_url, is_customer`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setAbout(data.about)
        setIsCustomer(data.is_customer)
        console.log(data)
        if (data.is_customer === null){
            setOpen(true)
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async({username, firstName, lastName, about, isCustomer}:IProfile) =>{
    try {
        setLoading(true)
        const user = db.auth.user()
  
        const updates = {
          id: user?.id,
          username,
          firstName,
          lastName,
          about,
          is_customer: isCustomer,
          updated_at: new Date(),
        }
  
        let { error } = await db.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })
  
        if (error) {
          throw error
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }

  }

  return (
    <div>
        {/* {setOpen ? 
            <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              static
              className="fixed z-10 inset-0 overflow-y-auto"
              initialFocus={cancelButtonRef}
              open={open}
              onClose={setOpen}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
      
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          Payment successful
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo
                            pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root> 
          : */}
          <main className="relative pt-6">
          <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
  
  
                <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
                  {/* Profile section */}
                  <div className="py-6 px-4 sm:p-6 lg:pb-8">
                    <div>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">{!session ? 'not logged in' : 'logged in'}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        This information will be kept private
                      </p>
                    </div>
  
                    <div className="mt-6 flex flex-col lg:flex-row">
                      <div className="flex-grow space-y-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            username:
                          </label>
                          <div className="mt-1 flex">
                 
                            <input
                              type="text"
                              name="username"
                              id="username"
                              autoComplete="username"
                              className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm"
                              defaultValue={user.handle}
                              onChange={(e) => {setUsername(e.target.value)
                            }}
                              value={username || ''}
                            />
                          </div>
                        </div>
  
                        <div>
                          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            About
                          </label>
                          <div className="mt-1">
                            <textarea
                          onChange={(e) => setAbout(e.target.value)}
                          value={about}
                              id="about"
                              name="about"
                              rows={3}
                              className="shadow-sm focus:ring-light-blue-500 focus:border-light-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Brief description for your profile. URLs are hyperlinked.
                          </p>
                        </div>
                      </div>
  
                      
                    </div>
  
                    <div className="mt-6 grid grid-cols-12 gap-6">
                      <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                          autoComplete="given-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm"
                        />
                      </div>
  
                      <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                          type="text"
                          name="last_name"
                          id="last_name"
                          autoComplete="family-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm"
                        />
                      </div>
  
                      <div className="col-span-12">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                          URL
                        </label>
                        <input
                          type="text"
                          name="url"
                          id="url"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm"
                        />
                      </div>
  
                      <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          autoComplete="organization"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
  
                  {/* Privacy section */}
                  <div className="pt-6 divide-y divide-gray-200">
                    <div className="px-4 sm:px-6">
                      <div>
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Privacy</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
                        </p>
                      </div>
                      <ul className="mt-2 divide-y divide-gray-200">
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                              Available to hire
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                            </Switch.Description>
                          </div>
                          <Switch
                            checked={availableToHire}
                            onChange={setAvailableToHire}
                            className={classNames(
                              availableToHire ? 'bg-teal-500' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500'
                            )}
                          >
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                availableToHire ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                              Make account private
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.
                            </Switch.Description>
                          </div>
                          <Switch
                            checked={privateAccount}
                            onChange={setPrivateAccount}
                            className={classNames(
                              privateAccount ? 'bg-teal-500' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500'
                            )}
                          >
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                privateAccount ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                              Allow commenting
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              Integer amet, nunc hendrerit adipiscing nam. Elementum ame
                            </Switch.Description>
                          </div>
                          <Switch
                            checked={allowCommenting}
                            onChange={setAllowCommenting}
                            className={classNames(
                              allowCommenting ? 'bg-teal-500' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500'
                            )}
                          >
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                allowCommenting ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                              Allow mentions
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              Adipiscing est venenatis enim molestie commodo eu gravid
                            </Switch.Description>
                          </div>
                          <Switch
                            checked={allowMentions}
                            onChange={setAllowMentions}
                            className={classNames(
                              allowMentions ? 'bg-teal-500' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500'
                            )}
                          >
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                allowMentions ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                      </ul>
                    </div>
                    <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                      <button onClick={() => db.auth.signOut()}
                        type="button"
                        className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                      >
                        logout
                      </button>
                      <button
                                onClick={() => updateProfile({ username, firstName, lastName, about, isCustomer })}
                                disabled={loading}
                        type="submit"
                        className="ml-5 bg-light-blue-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-black hover:bg-light-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                      >
          {loading ? 'Loading ...' : 'Update'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>     
    {/* } */}

     
    </div>
  )
}
