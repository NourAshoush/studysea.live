package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Task;
import uk.ac.bham.teamproject.domain.UserExtended;
import uk.ac.bham.teamproject.repository.TaskRepository;
import uk.ac.bham.teamproject.service.criteria.TaskCriteria;

/**
 * Integration tests for the {@link TaskResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TaskResourceIT {

    private static final Instant DEFAULT_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final Integer DEFAULT_STUDY_LENGTH = 1;
    private static final Integer UPDATED_STUDY_LENGTH = 2;
    private static final Integer SMALLER_STUDY_LENGTH = 1 - 1;

    private static final Integer DEFAULT_BREAK_LENGTH = 1;
    private static final Integer UPDATED_BREAK_LENGTH = 2;
    private static final Integer SMALLER_BREAK_LENGTH = 1 - 1;

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final String ENTITY_API_URL = "/api/tasks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaskMockMvc;

    private Task task;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Task createEntity(EntityManager em) {
        Task task = new Task()
            .start(DEFAULT_START)
            .creation(DEFAULT_CREATION)
            .title(DEFAULT_TITLE)
            .subject(DEFAULT_SUBJECT)
            .studyLength(DEFAULT_STUDY_LENGTH)
            .breakLength(DEFAULT_BREAK_LENGTH)
            .completed(DEFAULT_COMPLETED);
        return task;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Task createUpdatedEntity(EntityManager em) {
        Task task = new Task()
            .start(UPDATED_START)
            .creation(UPDATED_CREATION)
            .title(UPDATED_TITLE)
            .subject(UPDATED_SUBJECT)
            .studyLength(UPDATED_STUDY_LENGTH)
            .breakLength(UPDATED_BREAK_LENGTH)
            .completed(UPDATED_COMPLETED);
        return task;
    }

    @BeforeEach
    public void initTest() {
        task = createEntity(em);
    }

    @Test
    @Transactional
    void createTask() throws Exception {
        int databaseSizeBeforeCreate = taskRepository.findAll().size();
        // Create the Task
        restTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isCreated());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeCreate + 1);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testTask.getCreation()).isEqualTo(DEFAULT_CREATION);
        assertThat(testTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTask.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testTask.getStudyLength()).isEqualTo(DEFAULT_STUDY_LENGTH);
        assertThat(testTask.getBreakLength()).isEqualTo(DEFAULT_BREAK_LENGTH);
        assertThat(testTask.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
    }

    @Test
    @Transactional
    void createTaskWithExistingId() throws Exception {
        // Create the Task with an existing ID
        task.setId(1L);

        int databaseSizeBeforeCreate = taskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTasks() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(task.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION.toString())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].studyLength").value(hasItem(DEFAULT_STUDY_LENGTH)))
            .andExpect(jsonPath("$.[*].breakLength").value(hasItem(DEFAULT_BREAK_LENGTH)))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())));
    }

    @Test
    @Transactional
    void getTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get the task
        restTaskMockMvc
            .perform(get(ENTITY_API_URL_ID, task.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(task.getId().intValue()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.creation").value(DEFAULT_CREATION.toString()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT))
            .andExpect(jsonPath("$.studyLength").value(DEFAULT_STUDY_LENGTH))
            .andExpect(jsonPath("$.breakLength").value(DEFAULT_BREAK_LENGTH))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()));
    }

    @Test
    @Transactional
    void getTasksByIdFiltering() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        Long id = task.getId();

        defaultTaskShouldBeFound("id.equals=" + id);
        defaultTaskShouldNotBeFound("id.notEquals=" + id);

        defaultTaskShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultTaskShouldNotBeFound("id.greaterThan=" + id);

        defaultTaskShouldBeFound("id.lessThanOrEqual=" + id);
        defaultTaskShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllTasksByStartIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where start equals to DEFAULT_START
        defaultTaskShouldBeFound("start.equals=" + DEFAULT_START);

        // Get all the taskList where start equals to UPDATED_START
        defaultTaskShouldNotBeFound("start.equals=" + UPDATED_START);
    }

    @Test
    @Transactional
    void getAllTasksByStartIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where start in DEFAULT_START or UPDATED_START
        defaultTaskShouldBeFound("start.in=" + DEFAULT_START + "," + UPDATED_START);

        // Get all the taskList where start equals to UPDATED_START
        defaultTaskShouldNotBeFound("start.in=" + UPDATED_START);
    }

    @Test
    @Transactional
    void getAllTasksByStartIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where start is not null
        defaultTaskShouldBeFound("start.specified=true");

        // Get all the taskList where start is null
        defaultTaskShouldNotBeFound("start.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByCreationIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where creation equals to DEFAULT_CREATION
        defaultTaskShouldBeFound("creation.equals=" + DEFAULT_CREATION);

        // Get all the taskList where creation equals to UPDATED_CREATION
        defaultTaskShouldNotBeFound("creation.equals=" + UPDATED_CREATION);
    }

    @Test
    @Transactional
    void getAllTasksByCreationIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where creation in DEFAULT_CREATION or UPDATED_CREATION
        defaultTaskShouldBeFound("creation.in=" + DEFAULT_CREATION + "," + UPDATED_CREATION);

        // Get all the taskList where creation equals to UPDATED_CREATION
        defaultTaskShouldNotBeFound("creation.in=" + UPDATED_CREATION);
    }

    @Test
    @Transactional
    void getAllTasksByCreationIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where creation is not null
        defaultTaskShouldBeFound("creation.specified=true");

        // Get all the taskList where creation is null
        defaultTaskShouldNotBeFound("creation.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title equals to DEFAULT_TITLE
        defaultTaskShouldBeFound("title.equals=" + DEFAULT_TITLE);

        // Get all the taskList where title equals to UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultTaskShouldBeFound("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE);

        // Get all the taskList where title equals to UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title is not null
        defaultTaskShouldBeFound("title.specified=true");

        // Get all the taskList where title is null
        defaultTaskShouldNotBeFound("title.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByTitleContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title contains DEFAULT_TITLE
        defaultTaskShouldBeFound("title.contains=" + DEFAULT_TITLE);

        // Get all the taskList where title contains UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title does not contain DEFAULT_TITLE
        defaultTaskShouldNotBeFound("title.doesNotContain=" + DEFAULT_TITLE);

        // Get all the taskList where title does not contain UPDATED_TITLE
        defaultTaskShouldBeFound("title.doesNotContain=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksBySubjectIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where subject equals to DEFAULT_SUBJECT
        defaultTaskShouldBeFound("subject.equals=" + DEFAULT_SUBJECT);

        // Get all the taskList where subject equals to UPDATED_SUBJECT
        defaultTaskShouldNotBeFound("subject.equals=" + UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void getAllTasksBySubjectIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where subject in DEFAULT_SUBJECT or UPDATED_SUBJECT
        defaultTaskShouldBeFound("subject.in=" + DEFAULT_SUBJECT + "," + UPDATED_SUBJECT);

        // Get all the taskList where subject equals to UPDATED_SUBJECT
        defaultTaskShouldNotBeFound("subject.in=" + UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void getAllTasksBySubjectIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where subject is not null
        defaultTaskShouldBeFound("subject.specified=true");

        // Get all the taskList where subject is null
        defaultTaskShouldNotBeFound("subject.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksBySubjectContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where subject contains DEFAULT_SUBJECT
        defaultTaskShouldBeFound("subject.contains=" + DEFAULT_SUBJECT);

        // Get all the taskList where subject contains UPDATED_SUBJECT
        defaultTaskShouldNotBeFound("subject.contains=" + UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void getAllTasksBySubjectNotContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where subject does not contain DEFAULT_SUBJECT
        defaultTaskShouldNotBeFound("subject.doesNotContain=" + DEFAULT_SUBJECT);

        // Get all the taskList where subject does not contain UPDATED_SUBJECT
        defaultTaskShouldBeFound("subject.doesNotContain=" + UPDATED_SUBJECT);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength equals to DEFAULT_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.equals=" + DEFAULT_STUDY_LENGTH);

        // Get all the taskList where studyLength equals to UPDATED_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.equals=" + UPDATED_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength in DEFAULT_STUDY_LENGTH or UPDATED_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.in=" + DEFAULT_STUDY_LENGTH + "," + UPDATED_STUDY_LENGTH);

        // Get all the taskList where studyLength equals to UPDATED_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.in=" + UPDATED_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength is not null
        defaultTaskShouldBeFound("studyLength.specified=true");

        // Get all the taskList where studyLength is null
        defaultTaskShouldNotBeFound("studyLength.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength is greater than or equal to DEFAULT_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.greaterThanOrEqual=" + DEFAULT_STUDY_LENGTH);

        // Get all the taskList where studyLength is greater than or equal to UPDATED_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.greaterThanOrEqual=" + UPDATED_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength is less than or equal to DEFAULT_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.lessThanOrEqual=" + DEFAULT_STUDY_LENGTH);

        // Get all the taskList where studyLength is less than or equal to SMALLER_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.lessThanOrEqual=" + SMALLER_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength is less than DEFAULT_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.lessThan=" + DEFAULT_STUDY_LENGTH);

        // Get all the taskList where studyLength is less than UPDATED_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.lessThan=" + UPDATED_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByStudyLengthIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where studyLength is greater than DEFAULT_STUDY_LENGTH
        defaultTaskShouldNotBeFound("studyLength.greaterThan=" + DEFAULT_STUDY_LENGTH);

        // Get all the taskList where studyLength is greater than SMALLER_STUDY_LENGTH
        defaultTaskShouldBeFound("studyLength.greaterThan=" + SMALLER_STUDY_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength equals to DEFAULT_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.equals=" + DEFAULT_BREAK_LENGTH);

        // Get all the taskList where breakLength equals to UPDATED_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.equals=" + UPDATED_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength in DEFAULT_BREAK_LENGTH or UPDATED_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.in=" + DEFAULT_BREAK_LENGTH + "," + UPDATED_BREAK_LENGTH);

        // Get all the taskList where breakLength equals to UPDATED_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.in=" + UPDATED_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength is not null
        defaultTaskShouldBeFound("breakLength.specified=true");

        // Get all the taskList where breakLength is null
        defaultTaskShouldNotBeFound("breakLength.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength is greater than or equal to DEFAULT_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.greaterThanOrEqual=" + DEFAULT_BREAK_LENGTH);

        // Get all the taskList where breakLength is greater than or equal to UPDATED_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.greaterThanOrEqual=" + UPDATED_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength is less than or equal to DEFAULT_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.lessThanOrEqual=" + DEFAULT_BREAK_LENGTH);

        // Get all the taskList where breakLength is less than or equal to SMALLER_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.lessThanOrEqual=" + SMALLER_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength is less than DEFAULT_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.lessThan=" + DEFAULT_BREAK_LENGTH);

        // Get all the taskList where breakLength is less than UPDATED_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.lessThan=" + UPDATED_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByBreakLengthIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where breakLength is greater than DEFAULT_BREAK_LENGTH
        defaultTaskShouldNotBeFound("breakLength.greaterThan=" + DEFAULT_BREAK_LENGTH);

        // Get all the taskList where breakLength is greater than SMALLER_BREAK_LENGTH
        defaultTaskShouldBeFound("breakLength.greaterThan=" + SMALLER_BREAK_LENGTH);
    }

    @Test
    @Transactional
    void getAllTasksByCompletedIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where completed equals to DEFAULT_COMPLETED
        defaultTaskShouldBeFound("completed.equals=" + DEFAULT_COMPLETED);

        // Get all the taskList where completed equals to UPDATED_COMPLETED
        defaultTaskShouldNotBeFound("completed.equals=" + UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void getAllTasksByCompletedIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where completed in DEFAULT_COMPLETED or UPDATED_COMPLETED
        defaultTaskShouldBeFound("completed.in=" + DEFAULT_COMPLETED + "," + UPDATED_COMPLETED);

        // Get all the taskList where completed equals to UPDATED_COMPLETED
        defaultTaskShouldNotBeFound("completed.in=" + UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void getAllTasksByCompletedIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where completed is not null
        defaultTaskShouldBeFound("completed.specified=true");

        // Get all the taskList where completed is null
        defaultTaskShouldNotBeFound("completed.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByCreatedByIsEqualToSomething() throws Exception {
        UserExtended createdBy;
        if (TestUtil.findAll(em, UserExtended.class).isEmpty()) {
            taskRepository.saveAndFlush(task);
            createdBy = UserExtendedResourceIT.createEntity(em);
        } else {
            createdBy = TestUtil.findAll(em, UserExtended.class).get(0);
        }
        em.persist(createdBy);
        em.flush();
        task.setCreatedBy(createdBy);
        taskRepository.saveAndFlush(task);
        Long createdById = createdBy.getId();

        // Get all the taskList where createdBy equals to createdById
        defaultTaskShouldBeFound("createdById.equals=" + createdById);

        // Get all the taskList where createdBy equals to (createdById + 1)
        defaultTaskShouldNotBeFound("createdById.equals=" + (createdById + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTaskShouldBeFound(String filter) throws Exception {
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(task.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].creation").value(hasItem(DEFAULT_CREATION.toString())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].studyLength").value(hasItem(DEFAULT_STUDY_LENGTH)))
            .andExpect(jsonPath("$.[*].breakLength").value(hasItem(DEFAULT_BREAK_LENGTH)))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())));

        // Check, that the count call also returns 1
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTaskShouldNotBeFound(String filter) throws Exception {
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingTask() throws Exception {
        // Get the task
        restTaskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task
        Task updatedTask = taskRepository.findById(task.getId()).get();
        // Disconnect from session so that the updates on updatedTask are not directly saved in db
        em.detach(updatedTask);
        updatedTask
            .start(UPDATED_START)
            .creation(UPDATED_CREATION)
            .title(UPDATED_TITLE)
            .subject(UPDATED_SUBJECT)
            .studyLength(UPDATED_STUDY_LENGTH)
            .breakLength(UPDATED_BREAK_LENGTH)
            .completed(UPDATED_COMPLETED);

        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTask.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTask.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testTask.getStudyLength()).isEqualTo(UPDATED_STUDY_LENGTH);
        assertThat(testTask.getBreakLength()).isEqualTo(UPDATED_BREAK_LENGTH);
        assertThat(testTask.getCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void putNonExistingTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, task.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTaskWithPatch() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task using partial update
        Task partialUpdatedTask = new Task();
        partialUpdatedTask.setId(task.getId());

        partialUpdatedTask.creation(UPDATED_CREATION).subject(UPDATED_SUBJECT);

        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testTask.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTask.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testTask.getStudyLength()).isEqualTo(DEFAULT_STUDY_LENGTH);
        assertThat(testTask.getBreakLength()).isEqualTo(DEFAULT_BREAK_LENGTH);
        assertThat(testTask.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
    }

    @Test
    @Transactional
    void fullUpdateTaskWithPatch() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task using partial update
        Task partialUpdatedTask = new Task();
        partialUpdatedTask.setId(task.getId());

        partialUpdatedTask
            .start(UPDATED_START)
            .creation(UPDATED_CREATION)
            .title(UPDATED_TITLE)
            .subject(UPDATED_SUBJECT)
            .studyLength(UPDATED_STUDY_LENGTH)
            .breakLength(UPDATED_BREAK_LENGTH)
            .completed(UPDATED_COMPLETED);

        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTask.getCreation()).isEqualTo(UPDATED_CREATION);
        assertThat(testTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTask.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testTask.getStudyLength()).isEqualTo(UPDATED_STUDY_LENGTH);
        assertThat(testTask.getBreakLength()).isEqualTo(UPDATED_BREAK_LENGTH);
        assertThat(testTask.getCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void patchNonExistingTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, task.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeDelete = taskRepository.findAll().size();

        // Delete the task
        restTaskMockMvc
            .perform(delete(ENTITY_API_URL_ID, task.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
