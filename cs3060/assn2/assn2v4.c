//Heather Hyer
//CS 3060-601 Fall 2018
//Assignment 2

/* Promise of Originality
I promise that this source code file has, in its entirety, been
written by myself and by no other person or persons. If at any time an
exact copy of this source code is found to be used by another person in
this term, I understand that both myself and the student that submitted
the copy will receive a zero on this assignment.
*/

#include<stdio.h>
#include<unistd.h> //needed to run fork
#include<sys/types.h> //needed to run fork

#define FD_READ 0
#define FD_WRITE 1

int main(int argc, char *argv[]) {
  FILE *file = stdin;

  //Processes
  pid_t p;
  int fp[2];
  pipe(fp);
  p = fork(); //p for the parent is the process id, and p for the child is 0

  if (p < 0) {
    perror("Creating process");
    return -1;
  }
  if (p == 0) { //child process
    close(fp[FD_WRITE]);
    dup2(fp[FD_READ], 0);
    close(fp[FD_READ]);
    execlp("bc", "bc", "-n", NULL);
    perror("Cannot exec");
    return -1;
  }
  else { //parent process
    FILE *fout = fdopen(fp[FD_WRITE], "r");
    close(fp[FD_READ]);

    if (argc > 1) {
      file = fopen(argv[1], "r");
    } else {
      printf("Please enter 3 integers at a time\n");
    }

    if (file == NULL) {
      printf("Unable to open the file %s\n", argv[1]);
      perror("Trying to open file");
      return -1;
    }

    int num1;
    int num2;
    int num3;

    dprintf(fp[FD_WRITE], "scale=4\n");

    while (fscanf(file, "%d %d %d", &num1, &num2, &num3) == EOF) {
      dprintf(fp[FD_WRITE], "(%d * %d) / %d\n", num1, num2, num3);
      fscanf(fout, "%lf", &total);
    }

    close(fp[FD_WRITE]);
    int ret;
    wait(&ret);
    printf("Child completed with %d\n", WEXITSTATUS(ret));
  }

  return 0;
}
