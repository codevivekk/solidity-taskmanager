'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMarkCompleted: (id: string, completed: boolean) => void;
}

export default function TaskList({
  tasks,
  onDelete,
  onEdit,
  onMarkCompleted,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-center">
            No tasks yet. Click the &quot;Add Task&quot; button to create your
            first task.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
      if(task.title === "") return null;
        return (
          <Card
            key={task.id}
            className={cn('transition-all', task.completed && 'opacity-80')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    onMarkCompleted(task.id, task.title, checked);
                  }}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      'text-lg font-medium',
                      task.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      className={cn(
                        'text-sm text-muted-foreground mt-1',
                        task.completed && 'line-through'
                      )}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(task.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
