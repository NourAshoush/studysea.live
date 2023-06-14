package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
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
import uk.ac.bham.teamproject.domain.AfterStudy;
import uk.ac.bham.teamproject.repository.AfterStudyRepository;

/**
 * Integration tests for the {@link AfterStudyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AfterStudyResourceIT {

    private static final Duration DEFAULT_TIME_SPENT = Duration.ofHours(6);
    private static final Duration UPDATED_TIME_SPENT = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/after-studies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AfterStudyRepository afterStudyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAfterStudyMockMvc;

    private AfterStudy afterStudy;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AfterStudy createEntity(EntityManager em) {
        AfterStudy afterStudy = new AfterStudy().timeSpent(DEFAULT_TIME_SPENT);
        return afterStudy;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AfterStudy createUpdatedEntity(EntityManager em) {
        AfterStudy afterStudy = new AfterStudy().timeSpent(UPDATED_TIME_SPENT);
        return afterStudy;
    }

    @BeforeEach
    public void initTest() {
        afterStudy = createEntity(em);
    }

    @Test
    @Transactional
    void createAfterStudy() throws Exception {
        int databaseSizeBeforeCreate = afterStudyRepository.findAll().size();
        // Create the AfterStudy
        restAfterStudyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(afterStudy)))
            .andExpect(status().isCreated());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeCreate + 1);
        AfterStudy testAfterStudy = afterStudyList.get(afterStudyList.size() - 1);
        assertThat(testAfterStudy.getTimeSpent()).isEqualTo(DEFAULT_TIME_SPENT);
    }

    @Test
    @Transactional
    void createAfterStudyWithExistingId() throws Exception {
        // Create the AfterStudy with an existing ID
        afterStudy.setId(1L);

        int databaseSizeBeforeCreate = afterStudyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAfterStudyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(afterStudy)))
            .andExpect(status().isBadRequest());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAfterStudies() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        // Get all the afterStudyList
        restAfterStudyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(afterStudy.getId().intValue())))
            .andExpect(jsonPath("$.[*].timeSpent").value(hasItem(DEFAULT_TIME_SPENT.toString())));
    }

    @Test
    @Transactional
    void getAfterStudy() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        // Get the afterStudy
        restAfterStudyMockMvc
            .perform(get(ENTITY_API_URL_ID, afterStudy.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(afterStudy.getId().intValue()))
            .andExpect(jsonPath("$.timeSpent").value(DEFAULT_TIME_SPENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAfterStudy() throws Exception {
        // Get the afterStudy
        restAfterStudyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAfterStudy() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();

        // Update the afterStudy
        AfterStudy updatedAfterStudy = afterStudyRepository.findById(afterStudy.getId()).get();
        // Disconnect from session so that the updates on updatedAfterStudy are not directly saved in db
        em.detach(updatedAfterStudy);
        updatedAfterStudy.timeSpent(UPDATED_TIME_SPENT);

        restAfterStudyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAfterStudy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAfterStudy))
            )
            .andExpect(status().isOk());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
        AfterStudy testAfterStudy = afterStudyList.get(afterStudyList.size() - 1);
        assertThat(testAfterStudy.getTimeSpent()).isEqualTo(UPDATED_TIME_SPENT);
    }

    @Test
    @Transactional
    void putNonExistingAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, afterStudy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(afterStudy))
            )
            .andExpect(status().isBadRequest());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(afterStudy))
            )
            .andExpect(status().isBadRequest());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(afterStudy)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAfterStudyWithPatch() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();

        // Update the afterStudy using partial update
        AfterStudy partialUpdatedAfterStudy = new AfterStudy();
        partialUpdatedAfterStudy.setId(afterStudy.getId());

        restAfterStudyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAfterStudy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAfterStudy))
            )
            .andExpect(status().isOk());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
        AfterStudy testAfterStudy = afterStudyList.get(afterStudyList.size() - 1);
        assertThat(testAfterStudy.getTimeSpent()).isEqualTo(DEFAULT_TIME_SPENT);
    }

    @Test
    @Transactional
    void fullUpdateAfterStudyWithPatch() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();

        // Update the afterStudy using partial update
        AfterStudy partialUpdatedAfterStudy = new AfterStudy();
        partialUpdatedAfterStudy.setId(afterStudy.getId());

        partialUpdatedAfterStudy.timeSpent(UPDATED_TIME_SPENT);

        restAfterStudyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAfterStudy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAfterStudy))
            )
            .andExpect(status().isOk());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
        AfterStudy testAfterStudy = afterStudyList.get(afterStudyList.size() - 1);
        assertThat(testAfterStudy.getTimeSpent()).isEqualTo(UPDATED_TIME_SPENT);
    }

    @Test
    @Transactional
    void patchNonExistingAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, afterStudy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(afterStudy))
            )
            .andExpect(status().isBadRequest());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(afterStudy))
            )
            .andExpect(status().isBadRequest());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAfterStudy() throws Exception {
        int databaseSizeBeforeUpdate = afterStudyRepository.findAll().size();
        afterStudy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAfterStudyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(afterStudy))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AfterStudy in the database
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAfterStudy() throws Exception {
        // Initialize the database
        afterStudyRepository.saveAndFlush(afterStudy);

        int databaseSizeBeforeDelete = afterStudyRepository.findAll().size();

        // Delete the afterStudy
        restAfterStudyMockMvc
            .perform(delete(ENTITY_API_URL_ID, afterStudy.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AfterStudy> afterStudyList = afterStudyRepository.findAll();
        assertThat(afterStudyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
