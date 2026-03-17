"I built an on-chain Task Manager where each user can create, update, and delete their own tasks — all stored permanently on the blockchain.
I used a struct to model each task with an ID, title, description, completion status, and owner address. Two mappings power the system — one to look up any task by ID, and another to track all task IDs per user address.
For access control, I used a custom onlyTaskOwner modifier so only the task creator can modify or delete their task. I also inherited OpenZeppelin's Ownable for admin-level functions like resetTasks().
Key things I'd improve — adding events for frontend reactivity, fixing the delete function to also clean up the user's task ID array, and adding pagination for getTasks() to handle scale."
