export type Action =

  // APP
  {
    type: 'app/initialize',
  } |
  {
    type: 'app/toggle-setting',
    setting: string,
  } |
  {
    type: 'app/update-setting',
    setting: string,
    value: string|boolean,
  } |

  // EXPENSES
  {
    type: 'expense/update',
    id: string,
    text: string,
  } |
  {
    type: 'expense/create'
  };
