// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is Ownable {
    struct Task {
        uint256 id;
        string title;
        string descriptin;
        bool completed;
        address owner;
    }

    uint256 private nextTaskId;
    mapping(uint256 => Task) private tsks;
    mapping(address => uint256[]) private userTsks;

    modifier onlyTaskOwner(uint256 taskId) {
        require(tsks[taskId].owner == msg.sender, "Not task owner");
        _;
    }

     constructor() Ownable(msg.sender) {} 

    function addTask(string memory _title, string memory _descriptin) external {
        tsks[nextTaskId] = Task(nextTaskId, _title, _descriptin, false, msg.sender);
        userTsks[msg.sender].push(nextTaskId);
        nextTaskId++;
    }

    function updateTask(uint256 _taskId, string memory _title, bool _completed) external onlyTaskOwner(_taskId) {
        Task storage tsk = tsks[_taskId];
        tsk.title = _title;
        tsk.completed = _completed;
    }

    function deleteTask(uint256 _taskId) external onlyTaskOwner(_taskId) {
        delete tsks[_taskId];
    }

    function getTasks() public view returns (Task[] memory){
        uint256[] storage tskIds = userTsks[msg.sender];
        require(tskIds.length > 0, "No tasks found for this user.");
        Task[] memory result = new Task[](tskIds.length);
        for (uint256 i = 0; i < tskIds.length; i++) {
            result[i] = tsks[tskIds[i]];
        }
        return result;
    }

    // Example: Only the contract owner can reset the task manager
    function resetTasks() external onlyOwner {
        nextTaskId = 0;
    }
}
