### How long did I spend on this coding test?

I spent 4 days on this test writing application code, tests and CI/CD setup.

### What would I add to my solution if I had more time?

I would add the following features if I had more time:

- User authentication to make favorite things use scoped.

- User should be able to share list of favorite things on a social media platform.

- Multi-user favorite thing accounts for teams

- User should be able to comment on favorite thing


### What was the most useful feature that was added to the latest version of my chosen language?

My chosen language is Python. Python 3.7 was released on the 27th of June, 2018. It brought in cool features like builtin breakpoint function, data classes, improved type hinting and annotations etc to Python.

My personal favorite is the builtin breakpoint function. This eases debugging and removes the need to use pdb.

Here's an example of it's use:

```python
def add(first_num, second_num):
    breakpoint()
    return first_num + second_num
```

### How would I track down a performance issue in production?

Tracking down a performance issue in production can be quite tricky because the reasons for performance issues in production can range from buggy code to insufficient server resources.

To pin down the performance issues quickly it is important to keep log records of application activities. If a logs are set up there are the first point I use to investigate why the application is slow or not responsive. If logs are not available a crashing application might leave a stack trace of the error that crashed it.

Once the reason has been found from viewing the logs or stack trace. I would try to reproduce the error locally.

There are certain cases where performance issues are caused by insufficient server resources. Using cloud providers makes this easy to spot as they usually have real-time analytics of server resource utilization. If an on premise server is used, I would have to manually check the current RAM and CPU usage. If the performance issue is caused by insufficient server resources, the solution would be to increased the resources available to that machine to accommodate the increased demand.

#### A scenerio where I had to track down performance issues on a production application

I was once responsible for deploying a Python application that used Spacy for Natural Language Processing (NLP). I deployed the application on a machine with 4 Gigabytes RAM and it ran fine until I got complains that the application went down when multiple users tried accessing it. I used Digital Ocean to deploy this applcation so I logged into  the dashboard and noticed that the memory usage was clocking 100%. I upgraded the droplet to 8G, the application performed better was still slow. I had to use 16G of RAM to gain optimal performance for the application.m
