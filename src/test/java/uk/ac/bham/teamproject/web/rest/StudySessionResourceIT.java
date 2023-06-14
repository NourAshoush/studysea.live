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
import uk.ac.bham.teamproject.domain.StudySession;
import uk.ac.bham.teamproject.repository.StudySessionRepository;

/**
 * Integration tests for the {@link StudySessionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StudySessionResourceIT {

    private static final Instant DEFAULT_ACTUAL_START = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ACTUAL_START = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_PRIVATE = false;
    private static final Boolean UPDATED_IS_PRIVATE = true;

    private static final String ENTITY_API_URL = "/api/study-sessions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudySessionMockMvc;

    private StudySession studySession;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudySession createEntity(EntityManager em) {
        StudySession studySession = new StudySession().actualStart(DEFAULT_ACTUAL_START).isPrivate(DEFAULT_IS_PRIVATE);
        return studySession;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudySession createUpdatedEntity(EntityManager em) {
        StudySession studySession = new StudySession().actualStart(UPDATED_ACTUAL_START).isPrivate(UPDATED_IS_PRIVATE);
        return studySession;
    }

    @BeforeEach
    public void initTest() {
        studySession = createEntity(em);
    }

    @Test
    @Transactional
    void createStudySession() throws Exception {
        int databaseSizeBeforeCreate = studySessionRepository.findAll().size();
        // Create the StudySession
        restStudySessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studySession)))
            .andExpect(status().isCreated());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeCreate + 1);
        StudySession testStudySession = studySessionList.get(studySessionList.size() - 1);
        assertThat(testStudySession.getActualStart()).isEqualTo(DEFAULT_ACTUAL_START);
        assertThat(testStudySession.getIsPrivate()).isEqualTo(DEFAULT_IS_PRIVATE);
    }

    @Test
    @Transactional
    void createStudySessionWithExistingId() throws Exception {
        // Create the StudySession with an existing ID
        studySession.setId(1L);

        int databaseSizeBeforeCreate = studySessionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudySessionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studySession)))
            .andExpect(status().isBadRequest());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStudySessions() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        // Get all the studySessionList
        restStudySessionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studySession.getId().intValue())))
            .andExpect(jsonPath("$.[*].actualStart").value(hasItem(DEFAULT_ACTUAL_START.toString())))
            .andExpect(jsonPath("$.[*].isPrivate").value(hasItem(DEFAULT_IS_PRIVATE.booleanValue())));
    }

    @Test
    @Transactional
    void getStudySession() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        // Get the studySession
        restStudySessionMockMvc
            .perform(get(ENTITY_API_URL_ID, studySession.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(studySession.getId().intValue()))
            .andExpect(jsonPath("$.actualStart").value(DEFAULT_ACTUAL_START.toString()))
            .andExpect(jsonPath("$.isPrivate").value(DEFAULT_IS_PRIVATE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingStudySession() throws Exception {
        // Get the studySession
        restStudySessionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudySession() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();

        // Update the studySession
        StudySession updatedStudySession = studySessionRepository.findById(studySession.getId()).get();
        // Disconnect from session so that the updates on updatedStudySession are not directly saved in db
        em.detach(updatedStudySession);
        updatedStudySession.actualStart(UPDATED_ACTUAL_START).isPrivate(UPDATED_IS_PRIVATE);

        restStudySessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStudySession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStudySession))
            )
            .andExpect(status().isOk());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
        StudySession testStudySession = studySessionList.get(studySessionList.size() - 1);
        assertThat(testStudySession.getActualStart()).isEqualTo(UPDATED_ACTUAL_START);
        assertThat(testStudySession.getIsPrivate()).isEqualTo(UPDATED_IS_PRIVATE);
    }

    @Test
    @Transactional
    void putNonExistingStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studySession.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studySession))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studySession))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studySession)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudySessionWithPatch() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();

        // Update the studySession using partial update
        StudySession partialUpdatedStudySession = new StudySession();
        partialUpdatedStudySession.setId(studySession.getId());

        restStudySessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudySession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudySession))
            )
            .andExpect(status().isOk());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
        StudySession testStudySession = studySessionList.get(studySessionList.size() - 1);
        assertThat(testStudySession.getActualStart()).isEqualTo(DEFAULT_ACTUAL_START);
        assertThat(testStudySession.getIsPrivate()).isEqualTo(DEFAULT_IS_PRIVATE);
    }

    @Test
    @Transactional
    void fullUpdateStudySessionWithPatch() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();

        // Update the studySession using partial update
        StudySession partialUpdatedStudySession = new StudySession();
        partialUpdatedStudySession.setId(studySession.getId());

        partialUpdatedStudySession.actualStart(UPDATED_ACTUAL_START).isPrivate(UPDATED_IS_PRIVATE);

        restStudySessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudySession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudySession))
            )
            .andExpect(status().isOk());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
        StudySession testStudySession = studySessionList.get(studySessionList.size() - 1);
        assertThat(testStudySession.getActualStart()).isEqualTo(UPDATED_ACTUAL_START);
        assertThat(testStudySession.getIsPrivate()).isEqualTo(UPDATED_IS_PRIVATE);
    }

    @Test
    @Transactional
    void patchNonExistingStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studySession.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studySession))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studySession))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudySession() throws Exception {
        int databaseSizeBeforeUpdate = studySessionRepository.findAll().size();
        studySession.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudySessionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(studySession))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudySession in the database
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudySession() throws Exception {
        // Initialize the database
        studySessionRepository.saveAndFlush(studySession);

        int databaseSizeBeforeDelete = studySessionRepository.findAll().size();

        // Delete the studySession
        restStudySessionMockMvc
            .perform(delete(ENTITY_API_URL_ID, studySession.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StudySession> studySessionList = studySessionRepository.findAll();
        assertThat(studySessionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
